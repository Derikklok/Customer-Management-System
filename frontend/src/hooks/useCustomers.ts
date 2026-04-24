import { useQuery } from "@tanstack/react-query";
import type { CustomerListParams } from "../types/customer.types";
import { getCustomers, getCustomerById } from "../services/customer.service";

const CUSTOMERS_QUERY_KEY = 'customers';

export const useCustomers = (params: CustomerListParams = {}) => {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, params],
    queryFn: () => getCustomers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomer = (id: number | undefined) => {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id],
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};