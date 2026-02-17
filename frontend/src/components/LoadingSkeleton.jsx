import React from "react";

/**
 * Loading Skeleton Component
 *
 * Provides visual feedback during data loading.
 * Better UX than spinners for content-heavy pages.
 *
 * @param {string} variant - Type of skeleton: 'card' | 'text' | 'stat' | 'transaction' | 'budget'
 * @param {number} count - Number of skeleton items to render (default: 1)
 */
export const LoadingSkeleton = ({ variant = "card", count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "stat":
        return (
          <div className="card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        );

      case "transaction":
        return (
          <div className="flex items-center justify-between py-3 border-b border-gray-100 animate-pulse">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-2 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
          </div>
        );

      case "text":
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        );

      case "card":
      default:
        return (
          <div className="card p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

/**
 * Dashboard Loading Skeleton
 * Specific skeleton for dashboard page layout
 */
export const DashboardSkeleton = () => {
  return (
    <div className="container-responsive py-8 md:py-12">
      {/* Welcome Section Skeleton */}
      <div className="mb-12 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <LoadingSkeleton variant="stat" count={4} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions Skeleton */}
        <div className="lg:col-span-2 card p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              <LoadingSkeleton variant="transaction" count={5} />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                <LoadingSkeleton variant="budget" count={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
