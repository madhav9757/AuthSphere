import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsOverview,
  getAnalyticsCharts,
  getRecentActivity,
} from "@/api/AnalyticsAPI";

export const useAnalytics = (projectId) => {
  const overviewQuery = useQuery({
    queryKey: ["analytics", "overview", projectId],
    queryFn: () => getAnalyticsOverview(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const chartsQuery = useQuery({
    queryKey: ["analytics", "charts", projectId],
    queryFn: () => getAnalyticsCharts(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });

  const activityQuery = useQuery({
    queryKey: ["analytics", "activity", projectId],
    queryFn: () => getRecentActivity(projectId),
    enabled: !!projectId,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for real-time feel
  });

  return {
    overview: {
      data: overviewQuery.data?.data,
      isLoading: overviewQuery.isLoading,
      isError: overviewQuery.isError,
    },
    charts: {
      data: chartsQuery.data?.data,
      isLoading: chartsQuery.isLoading,
      isError: chartsQuery.isError,
    },
    activity: {
      data: activityQuery.data?.data,
      isLoading: activityQuery.isLoading,
      isError: activityQuery.isError,
    },
    isLoading:
      overviewQuery.isLoading ||
      chartsQuery.isLoading ||
      activityQuery.isLoading,
    isError:
      overviewQuery.isError || chartsQuery.isError || activityQuery.isError,
  };
};
