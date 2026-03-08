import { Repository } from "@/hooks/useGitHubAPI";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  Code,
  ExternalLink,
  GitFork,
  GitPullRequest,
  Star,
  TrendingUp,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RepositoryDetailProps {
  repo: Repository;
  onClose: () => void;
  layoutId: string;
  fetchDetailedStats: (repo: Repository) => Promise<Repository>;
}

export function RepositoryDetail({
  repo,
  onClose,
  layoutId,
  fetchDetailedStats,
}: RepositoryDetailProps) {
  const [detailedRepo, setDetailedRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detailed stats when component mounts
  useEffect(() => {
    const loadStats = async () => {
      // Skip if stats are already loaded
      if (repo.views !== undefined || !repo.owner) {
        setDetailedRepo(repo);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const detailed = await fetchDetailedStats(repo);
        setDetailedRepo(detailed);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load detailed stats"
        );
        setDetailedRepo(repo); // Fallback to basic repo data
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [repo, fetchDetailedStats]);

  const currentRepo = detailedRepo || repo;

  // Combine views and clones data for chart
  const chartData = (currentRepo.viewsData || []).map((view, idx) => ({
    date: view.date,
    views: view.count,
    clones: (currentRepo.clonesData || [])[idx]?.count || 0,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        layoutId={layoutId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-h-[90vh] w-full max-w-2xl overflow-y-auto pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <img
                src={repo.socialImage}
                alt={repo.name}
                className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {repo.name}
                </h2>
                <p className="text-slate-600 mb-3">{repo.description}</p>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View on GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Overview
              </h3>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-slate-600">
                    Loading detailed stats...
                  </span>
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-slate-600">Views</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    ) : (
                      currentRepo.views || 0
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {currentRepo.uniqueViews || 0} unique
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-600">Clones</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    ) : (
                      currentRepo.clones || 0
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {currentRepo.uniqueClones || 0} unique
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-slate-600">Stars</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {currentRepo.stars}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitFork className="w-5 h-5 text-slate-600" />
                    <span className="text-sm text-slate-600">Forks</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {currentRepo.forks}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitPullRequest className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-slate-600">
                      Pull Requests
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    ) : (
                      currentRepo.totalPulls || 0
                    )}
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-slate-600">Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    ) : (
                      currentRepo.totalIssues || 0
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Chart */}
            {chartData.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Traffic (Last 14 Days)
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorViews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0969da"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0969da"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorClones"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1a7f37"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1a7f37"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        className="text-xs text-slate-600"
                        tick={{ fill: "currentColor" }}
                      />
                      <YAxis
                        className="text-xs text-slate-600"
                        tick={{ fill: "currentColor" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#0969da"
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="Views"
                      />
                      <Area
                        type="monotone"
                        dataKey="clones"
                        stroke="#1a7f37"
                        fillOpacity={1}
                        fill="url(#colorClones)"
                        name="Clones"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Repository Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Repository Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Code className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Language</div>
                    <div className="font-medium text-slate-900">
                      {repo.language || "Not specified"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-medium text-slate-900">
                      {format(new Date(repo.createdAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Last Updated</div>
                    <div className="font-medium text-slate-900">
                      {format(new Date(repo.updatedAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Owner</div>
                    <div className="font-medium text-slate-900">
                      {repo.owner}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
