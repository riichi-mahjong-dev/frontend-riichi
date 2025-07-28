import { query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";

export type Province = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export type ProvinceResponse = {
  message: string;
  list: Array<Province>;
  has_more: boolean;
}

export const getProvinces = query(async (paginateRequest: PaginateRequest): Promise<ProvinceResponse> => {
  "use server";
  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Province>>(`/api/provinces?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Province>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "province-list");

export const getProvinceById = query(async (id: number): Promise<Province|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Province>>(`/api/provinces/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Province>).data;
}, 'province-detail');
