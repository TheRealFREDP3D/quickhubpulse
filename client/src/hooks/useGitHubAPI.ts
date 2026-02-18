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
  views: number;
  uniqueViews: number;
  clones: number;
  uniqueClones: number;
  totalPulls: number;
  totalIssues: number;
  viewsData: Array<{ date: string; count: number; uniques: number }>;
  clonesData: Array<{ date: string; count: number; uniques: number }>;
}

interface UseGitHubAPIReturn {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GITHUB_API_BASE = "https://api.github.com";

export function useGitHubAPI(token: string): UseGitHubAPIReturn {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithAuth = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  };

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user's repositories
      const repos = await fetchWithAuth(
        `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=100`
      );

      // Fetch additional stats for each repository
      const reposWithStats = await Promise.all(
        repos.map(async (repo: any) => {
          try {
            // Fetch traffic data (views and clones)
            const [views, clones, pullsResponse, issuesResponse] =
              await Promise.all([
                fetchWithAuth(
                  `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/traffic/views`
                ).catch(() => ({ count: 0, uniques: 0, views: [] })),
                fetchWithAuth(
                  `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/traffic/clones`
                ).catch(() => ({ count: 0, uniques: 0, clones: [] })),
                fetch(
                  `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/pulls?state=all&per_page=1`,
                  {
                    headers: {
                      Authorization: `token ${token}`,
                      Accept: "application/vnd.github.v3+json",
                    },
                  }
                ),
                fetch(
                  `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/issues?state=all&per_page=1`,
                  {
                    headers: {
                      Authorization: `token ${token}`,
                      Accept: "application/vnd.github.v3+json",
                    },
                  }
                ),
              ]);

            // Parse Link header to get total count
            const parseLinkHeader = (header: string | null) => {
              if (!header) return 0;
              const match = header.match(/page=(\d+)>; rel="last"/);
              return match ? parseInt(match[1], 10) : 1;
            };

            const pullsCount =
              parseLinkHeader(pullsResponse.headers.get("Link")) || 0;
            const issuesCount =
              parseLinkHeader(issuesResponse.headers.get("Link")) || 0;

            // Format traffic data for charts
            const formatTrafficData = (data: any[]) => {
              return data.map((item: any) => ({
                date: item.timestamp.split("T")[0],
                count: item.count,
                uniques: item.uniques,
              }));
            };

            return {
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
              defaultBranch: repo.default_branch,
              socialImage: `https://opengraph.githubassets.com/1/${repo.full_name}`,
              views: views.count || 0,
              uniqueViews: views.uniques || 0,
              clones: clones.count || 0,
              uniqueClones: clones.uniques || 0,
              totalPulls: pullsCount,
              totalIssues: issuesCount,
              viewsData: formatTrafficData(views.views || []),
              clonesData: formatTrafficData(clones.clones || []),
            };
          } catch (err) {
            console.error(`Error fetching stats for ${repo.name}:`, err);
            return {
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
              views: 0,
              uniqueViews: 0,
              clones: 0,
              uniqueClones: 0,
              totalPulls: 0,
              totalIssues: 0,
              viewsData: [],
              clonesData: [],
            };
          }
        })
      );

      setRepositories(reposWithStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch repositories";
      setError(errorMessage);
      console.error("Error fetching repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRepositories();
    }
  }, [token]);

  return { repositories, loading, error, refetch: fetchRepositories };
}
