import { useQuery } from "@tanstack/react-query";
import { getCountries, getCitiesByCountry } from "../services/location.service";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 24 * 60 * 60 * 1000, // Countries rarely change
  });
};

export const useCities = (countryId?: number) => {
  return useQuery({
    queryKey: ["cities", countryId],
    queryFn: () => (countryId ? getCitiesByCountry(countryId) : Promise.resolve([])),
    enabled: !!countryId,
    staleTime: 60 * 60 * 1000,
  });
};
