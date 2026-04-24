import axiosInstance from "../lib/axios";
import type {
  Customer,
  CustomerListParams,
  PaginatedResponse,
} from "../types/customer.types";

export const getCustomers = async (
  params: CustomerListParams,
): Promise<PaginatedResponse<Customer>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Customer>>(
    "/customers",
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? "name",
      },
    },
  );
  return data;
};
export const createCustomer = async (customer: any): Promise<Customer> => {
  const { data } = await axiosInstance.post<Customer>("/customers", customer);
  return data;
};

export const updateCustomer = async (id: number, customer: any): Promise<Customer> => {
  const { data } = await axiosInstance.put<Customer>(`/customers/${id}`, customer);
  return data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const { data } = await axiosInstance.get<Customer>(`/customers/${id}`);
  return data;
};

export const patchCustomer = async (id: number, customer: any): Promise<Customer> => {
  const { data } = await axiosInstance.patch<Customer>(`/customers/${id}`, customer);
  return data;
};

export const bulkCreateCustomers = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post<{ message: string }>("/customers/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};



