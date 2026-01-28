import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";


export const useSettingsData = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['mentor-profile'],
    queryFn: async () => {
      const response = await api.get("/mentor/profile");
      return response.data;
    },  
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  }); 

  const availabilityQuery = useQuery({
    queryKey: ['mentor-availability'],
    queryFn: async () => {
      const response = await api.get("/mentor/availability");
      return response.data;
    },
    staleTime: 0,
    cacheTime: 0, 
    refetchOnWindowFocus: false,
    enabled: false, 
  });

  const pricingQuery = useQuery({
    queryKey: ['mentor-pricing'],
    queryFn: async () => {
      const response = await api.get("/mentor/pricing");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: false, 
  }); 

  const fetchProfile = () => {
    return profileQuery.refetch();
  };

  const fetchAvailability = () => {
    return availabilityQuery.refetch();
  };

  const fetchPricing = () => {
    return pricingQuery.refetch();
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries(['mentor-profile']);
    queryClient.invalidateQueries(['mentor-availability']);
    queryClient.invalidateQueries(['mentor-pricing']);
    queryClient.invalidateQueries(['mentor-profile-image']);
  }; 

  return {

    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    

    availability: availabilityQuery.data,
    availabilityLoading: availabilityQuery.isLoading,
    

    pricing: pricingQuery.data,
    pricingLoading: pricingQuery.isLoading,
    

    fetchProfile,
    fetchAvailability,
    fetchPricing,
    invalidateAll,
  };
};
