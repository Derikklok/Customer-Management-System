// src/types/customer.ts

export interface Address {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  cityName: string;
  countryName: string;
  cityId: number;
  countryId: number;
}


export interface Customer {
  id: number;
  name: string;
  dateOfBirth: string;
  nicNumber: string;
  mobileNumbers: string[];
  addresses: Address[];
  familyMembers: Customer[];
}

export interface PageableSort {
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  sort: PageableSort;
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CustomerListParams {
  page?: number;
  size?: number;
  sort?: string;
}
