import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { DataQuality } from '../services/dataProcessor';

interface DataQualityIndicatorProps {
  quality: DataQuality;
  showDetails?: boolean;
  className?: string;
}

const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({ 
  quality, 
  showDetails = false, 
  className = '' 
}) => {
  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 0.8) return CheckCircle;
    if (score >= 0.6) return AlertTriangle;
    return XCircle;
  };

  const getQualityLabel = (score: number) => {
    if (score >= 0.8) return 'High Quality';
    if (score >= 0.6) return 'Medium Quality';
    return 'Low Quality';
  };

  const Icon = getQualityIcon(quality.overall);

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${getQualityColor(quality.overall)}`} />
        <span className={`text-sm font-medium ${getQualityColor(quality.overall)}`}>
          {getQualityLabel(quality.overall)} ({Math.round(quality.overall * 100)}%)
        </span>
        {showDetails && (
          <Info className="h-4 w-4 text-gray-400 cursor-help" title="Click for details" />
        )}
      </div>

      {showDetails && (
        <div className="mt-2 space-y-1">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completeness:</span>
              <span className={getQualityColor(quality.completeness)}>
                {Math.round(quality.completeness * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
              <span className={getQualityColor(quality.accuracy)}>
                {Math.round(quality.accuracy * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Freshness:</span>
              <span className={getQualityColor(quality.freshness)}>
                {Math.round(quality.freshness * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Consistency:</span>
              <span className={getQualityColor(quality.consistency)}>
                {Math.round(quality.consistency * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQualityIndicator;