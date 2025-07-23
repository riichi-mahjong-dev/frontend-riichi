import { query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";
import { Player } from "./player";
import { Parlour } from "./parlour";

export type MatchData = {
  approved_at: Date;
  id: number;
  parlour_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  players: Array<Player>;
  parlour?: Parlour;
}

export type MatchResponse = {
  message: string;
  list: Array<MatchData>;
}

export const getMatches = query(async (paginateRequest: PaginateRequest): Promise<MatchResponse> => {
  "use server";

  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<MatchData>>(`/api/matches?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
    };
  }

  const response = (res as PaginateResponse<MatchData>);
  return {
    message: response.message,
    list: response.data,
  };
}, "match-list");
