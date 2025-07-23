import { query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, toQueryParams } from "./base";

export type Player = {
  id: number;
  province_id: number;
  rank: number;
  name: string;
  country: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export type PlayerResponse = {
  message: string;
  list: Array<Player>;
}

export const getPlayers = query(async (paginateRequest: PaginateRequest): Promise<PlayerResponse> => {
  "use server";

  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Player>>(`/api/players?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
    };
  }

  const response = (res as PaginateResponse<Player>);
  return {
    message: response.message,
    list: response.data,
  };
}, "match-list");
