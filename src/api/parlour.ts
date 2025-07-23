import { query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, toQueryParams } from "./base";
import { Province } from "./province";

export type Parlour = {
  id: number;
  country: string;
  province_id: number;
  address: string;
  province?: Province;
}

export type ParlourResponse = {
  message: string;
  list: Array<Parlour>;
}

export const getParlours = query(async (paginateRequest: PaginateRequest): Promise<ParlourResponse> => {
  "use server";

  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Parlour>>(`/api/parlours?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
    };
  }

  const response = (res as PaginateResponse<Parlour>);
  return {
    message: response.message,
    list: response.data,
  };
}, "match-list");
