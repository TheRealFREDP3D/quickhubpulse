import { Repository } from "@/hooks/useGitHubAPI";
import {
  AlertCircle,
  Eye,
  GitFork,
  GitPullRequest,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface RepositoryCardProps {
  repo: Repository;
  onClick: () => void;
  layoutId: string;
  isFocused?: boolean;
  onFocus?: () => void;
}

export function RepositoryCard({
  repo,
  onClick,
  layoutId,
  isFocused = false,
  onFocus,
}: RepositoryCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      onFocus={onFocus}
      tabIndex={0}
      role="button"
      aria-pressed={isFocused}
      className={`bg-white border rounded-lg p-5 cursor-pointer transition-all duration-300 ${
        isFocused
          ? "border-blue-600 shadow-lg ring-2 ring-blue-400 ring-offset-2"
          : "border-slate-200 hover:shadow-md hover:border-blue-300"
      }`}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Image */}
      <div className="flex items-start gap-4 mb-4">
        <motion.img
          src={repo.socialImage}
          alt={repo.name}
          className="w-14 h-14 rounded-lg object-cover border border-slate-200"
          loading="lazy"
          onError={e => {
            (e.target as HTMLImageElement).src =
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate mb-1">
            {repo.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {repo.description || "No description available"}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <div>
            <div className="text-xs text-slate-500">Views</div>
            <div className="text-sm font-semibold text-slate-900">
              {repo.views ?? 0}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-xs text-slate-500">Clones</div>
            <div className="text-sm font-semibold text-slate-900">
              {repo.clones ?? 0}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-green-500" />
          <div>
            <div className="text-xs text-slate-500">Stars</div>
            <div className="text-sm font-semibold text-slate-900">
              {repo.stars}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500">Forks</div>
            <div className="text-sm font-semibold text-slate-900">
              {repo.forks}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Data Unavailable Warning */}
      {repo.trafficDataUnavailable && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            Traffic data unavailable - requires push access
          </p>
        </div>
      )}

      {/* Footer with PRs, Issues, and Language */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <GitPullRequest className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-slate-600">{repo.totalPulls ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-slate-600">{repo.totalIssues ?? 0}</span>
          </div>
        </div>
        {repo.language && (
          <div className="ml-auto">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {repo.language}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
