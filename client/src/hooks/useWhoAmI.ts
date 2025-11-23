import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { LoggedSessionDto } from "@/model/sessionData.ts";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const useWhoAmI = (authorizedEndpoint = true) => {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await api.get<LoggedSessionDto>("session/whoami");
      return response.data;
    },
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (authorizedEndpoint && !query.isLoading && !query.isFetching && !query.data) {
      navigate({ to: "/auth/login", replace: true, search: { redirect: window.location.pathname } });
    }
  }, [authorizedEndpoint, query.isLoading, query.isFetching, query.data, navigate]);

  return query;
};
