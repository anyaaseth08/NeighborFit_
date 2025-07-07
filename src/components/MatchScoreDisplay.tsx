import React from 'react';
import { Star, TrendingUp, Shield, MapPin, Heart, Zap } from 'lucide-react';
import { MatchScore } from '../services/matchingAlgorithm';

interface MatchScoreDisplayProps {
  matchScore: MatchScore;
  showDetails?: boolean;
  className?: string;
}

const MatchScoreDisplay: React.FC<MatchScoreDisplayProps> = ({ 
  matchScore, 
  showDetails = false, 
  className = '' 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 dark:bg-green-900';
    if (score >= 0.6) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const categoryIcons = {
    affordability: TrendingUp,
    safety: Shield,
    convenience: MapPin,
    lifestyle: Heart,
    commute: Zap
  };

  return (
    <div className={`${className}`}>
      {/* Overall Score */}
      <div className="flex items-center space-x-3 mb-3">
        <div className={`px-3 py-1 rounded-full ${getScoreBg(matchScore.totalScore)}`}>
          <span className={`text-lg font-bold ${getScoreColor(matchScore.totalScore)}`}>
            {Math.round(matchScore.totalScore * 100)}%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Match Score (Confidence: {Math.round(matchScore.confidence * 100)}%)
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      {showDetails && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(matchScore.categoryScores).map(([category, score]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm capitalize text-gray-900 dark:text-white">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 0.8 ? 'bg-green-600' : 
                          score >= 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {Math.round(score * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reasoning */}
          {matchScore.reasoning.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Why this matches you:
              </h4>
              <ul className="space-y-1">
                {matchScore.reasoning.map((reason, index) => (
                  <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-1">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchScoreDisplay;