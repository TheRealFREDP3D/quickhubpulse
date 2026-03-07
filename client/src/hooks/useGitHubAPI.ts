import { useEffect, useState } from "react";

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  owner: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  updatedAt: string;
  createdAt: string;
  defaultBranch: string;
  socialImage: string;
  // Detailed stats - loaded lazily
  views?: number;
  uniqueViews?: number;
  clones?: number;
  uniqueClones?: number;
  totalPulls?: number;
  totalIssues?: number;
  viewsData?: Array<{ date: string; count: number; uniques: number }>;
  clonesData?: Array<{ date: string; count: number; uniques: number }>;
}

interface UseGitHubAPIReturn {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchDetailedStats: (repo: Repository) => Promise<Repository>;
}

const GITHUB_API_BASE = "https://api.github.com";

// Simple concurrency limiter
class ConcurrencyLimiter {
  private running = 0;
  private queue: (() => void)[] = [];
  
  constructor(private limit: number = 5) {}
  
  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      };
      
      if (this.running < this.limit) {
        run();
      } else {
        this.queue.push(run);
      }
    });
  }
  
  private processQueue() {
    if (this.queue.length > 0 && this.running < this.limit) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

const statsLimiter = new ConcurrencyLimiter(5);
const statsCache = new Map<string, Repository>();

type TrafficViews = { count: number; uniques: number; views: any[] };
type TrafficClones = { count: number; uniques: number; clones: any[] };

const validateUsername = (username: string): boolean => {
  // GitHub usernames: 1-39 characters, alphanumeric and hyphens
  // Cannot start or end with hyphen
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
};

const buildReposUrl = (token?: string, username?: string): string => {
  if (username) {
    const trimmedUsername = username.trim();
    
    // Validate username format
    if (!validateUsername(trimmedUsername)) {
      throw new Error("Invalid GitHub username format");
    }
    
    // Encode username for safe URL construction
    const safeUsername = encodeURIComponent(trimmedUsername);
    return `${GITHUB_API_BASE}/users/${safeUsername}/repos?sort=updated&per_page=100`;
  }
  if (token) {
    return `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=100`;
  }
  throw new Error("Either token or username is required");
};

const buildHeaders = (token?: string): Record<string, string> => ({
  Accept: "application/vnd.github.v3+json",
  ...(token ? { Authorization: `token ${token}` } : {}),
});

export function useGitHubAPI(token: string, username?: string): UseGitHubAPIReturn {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithAuth = async (url: string) => {
    const response = await fetch(url, { headers: buildHeaders(token) });
    if (!response.ok) {
      let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
      
      if (response.status === 403) {
        if (token) {
          errorMessage = "GitHub API error: 403 Forbidden. This could be due to:\n• Invalid or expired access token\n• Token lacks required permissions (repo or public_repo scope)\n• API rate limit exceeded";
        } else {
          errorMessage = "GitHub API error: 403 Forbidden. This could be due to:\n• API rate limit exceeded for unauthenticated requests\n• Try again in a few minutes or use an access token";
        }
      } else if (response.status === 404) {
        errorMessage = "GitHub API error: 404 Not Found. The user may not exist or has no public repositories.";
      } else if (response.status === 401) {
        errorMessage = "GitHub API error: 401 Unauthorized. The access token is invalid or has been revoked.";
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  };

  const fetchResponseWithOptionalAuth = async (url: string): Promise<Response> => {
    const response = await fetch(url, { headers: buildHeaders(token) });
    if (!response.ok) {
      // Log warning but don't throw - we'll handle fallbacks
      console.warn(`GitHub API warning: ${response.status} ${response.statusText} for ${url}`);
    }
    return response;
  };

  const fetchCountWithFallback = async (url: string): Promise<number> => {
    try {
      const response = await fetchResponseWithOptionalAuth(url);
      if (!response.ok) {
        return 0;
      }
      
      const linkHeader = response.headers.get("Link");
      if (!linkHeader) {
        return 0;
      }
      
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (error) {
      // Network errors or other issues
      console.warn(`Failed to fetch count for ${url}:`, error);
      return 0;
    }
  };

  const fetchDetailedStats = async (repo: Repository): Promise<Repository> => {
    const cacheKey = `${repo.owner}/${repo.name}`;
    
    // Check cache first
    if (statsCache.has(cacheKey)) {
      return statsCache.get(cacheKey)!;
    }
    
    return statsLimiter.execute(async () => {
      try {
        // Skip expensive stats for public mode (no token)
        if (!token) {
          return repo;
        }
        
        const { views, clones } = await getTrafficStats(repo, token);
        
        // Fetch pull requests and issues counts with proper error handling
        const [pullsCount, issuesCount] = await Promise.all([
          fetchCountWithFallback(`${GITHUB_API_BASE}/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=1`),
          fetchCountWithFallback(`${GITHUB_API_BASE}/repos/${repo.owner}/${repo.name}/issues?state=all&per_page=1`),
        ]);
        
        // Format traffic data for charts
        const formatTrafficData = (data: any[]) => {
          return data.map((item: any) => ({
            date: item.timestamp.split("T")[0],
            count: item.count,
            uniques: item.uniques,
          }));
        };
        
        const detailedRepo: Repository = {
          ...repo,
          views: views.count || 0,
          uniqueViews: views.uniques || 0,
          clones: clones.count || 0,
          uniqueClones: clones.uniques || 0,
          totalPulls: pullsCount,
          totalIssues: issuesCount,
          viewsData: formatTrafficData(views.views || []),
          clonesData: formatTrafficData(clones.clones || []),
        };
        
        // Cache the result
        statsCache.set(cacheKey, detailedRepo);
        
        return detailedRepo;
      } catch (error) {
        console.error(`Error fetching detailed stats for ${repo.name}:`, error);
        return repo;
      }
    });
  };

  const getTrafficStats = async (
    repo: any,
    token?: string
  ): Promise<{ views: TrafficViews; clones: TrafficClones }> => {
    const defaultViews = { count: 0, uniques: 0, views: [] };
    const defaultClones = { count: 0, uniques: 0, clones: [] };

    if (!token) return { views: defaultViews, clones: defaultClones };

    const [views, clones] = await Promise.all([
      fetchWithAuth(
        `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/traffic/views`
      ).catch(() => defaultViews),
      fetchWithAuth(
        `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/traffic/clones`
      ).catch(() => defaultClones),
    ]);

    return { views, clones };
  };

  const fetchRepositories = async () => {
    if (!token && !username) {
      setError("Either token or username is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reposUrl = buildReposUrl(token, username);
      const repos = await fetchWithAuth(reposUrl);

      // Return basic repository data without expensive stats
      const basicRepos: Repository[] = repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        owner: repo.owner.login,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
        defaultBranch: repo.default_branch || "main",
        socialImage: `https://opengraph.githubassets.com/1/${repo.full_name}`,
        // Detailed stats are undefined until loaded
      }));

      setRepositories(basicRepos);
    } catch (err) {
      let errorMessage = "Failed to fetch repositories";
      
      if (err instanceof Error) {
        if (err.message === "Invalid GitHub username format") {
          errorMessage = "Invalid GitHub username. Usernames must be 1-39 characters long and can only contain letters, numbers, and hyphens (cannot start or end with a hyphen).";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error("Error fetching repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token || username) {
      fetchRepositories();
    }
  }, [token, username]);

  return { repositories, loading, error, refetch: fetchRepositories, fetchDetailedStats };
}
