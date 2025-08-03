import { query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";

export type Log = {
  id: number;
  job_type: string;
  payload: string;
  status: 'queue' | 'processing' | 'done' | 'error';
  reason: string;
  created_at: Date;
  updated_at: Date;
}
export type LogResponse = {
  message: string;
  list: Array<Log>;
  has_more: boolean;
}

export const getLogs = query(async (paginateRequest: PaginateRequest): Promise<LogResponse> => {
  "use server";
  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Log>>(`/api/logs?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Log>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "log-list");

export const getLogById = query(async (id: number): Promise<Log|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Log>>(`/api/logs/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Log>).data;
}, 'log-detail');
