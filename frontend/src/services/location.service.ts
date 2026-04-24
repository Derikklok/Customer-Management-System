import axiosInstance from "../lib/axios";
import type { Country, City } from "../types/location.types";

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await axiosInstance.get<Country[]>("/locations/countries");
  return data;
};

export const getCitiesByCountry = async (countryId: number): Promise<City[]> => {
  const { data } = await axiosInstance.get<City[]>(`/locations/countries/${countryId}/cities`);
  return data;
};
