import { action, query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";
import { Province } from "./province";

export type Parlour = {
  id: number;
  name: string;
  country: string;
  province_id: number;
  address: string;
  province?: Province;
}

export type ParlourResponse = {
  message: string;
  list: Array<Parlour>;
  has_more: boolean;
}

export type ParlourRequest = {
  name: string;
  country: string;
  province_id: number;
  address: string;
}

export const getParlours = query(async (paginateRequest: PaginateRequest): Promise<ParlourResponse> => {
  "use server";

  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Parlour>>(`/api/parlours?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Parlour>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "parlour-list");

export const getParlourById = query(async (id: number): Promise<Parlour|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Parlour>>(`/api/parlours/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Parlour>).data;
}, 'parlour-detail');

export const deleteParlourById = action(async (id: number): Promise<boolean> => {
  "use server";

  const res = await fetchApi<ResponseData<null>>(`/api/parlours/${id}`, {
    method: 'DELETE',
  });

  if (!res.success) {
    return false;
  }

  return true;
}, "parlour-delete");

export const createParlour = action(async (body: ParlourRequest): Promise<Parlour> => {
  "use server";

  const res = await fetchApi<ResponseData<Parlour>>(`/api/parlours`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Parlour>).data;
}, "parlour-create");

export const updateParlour = action(async (id: number, body: ParlourRequest): Promise<Parlour> => {
  "use server";

  const res = await fetchApi<ResponseData<Parlour>>(`/api/parlours/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Parlour>).data;
}, "parlour-update");

