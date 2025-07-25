import { action, query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";
import { Player } from "./player";
import { Parlour } from "./parlour";

export type MatchPlayer = {
  id: number;
  match_id: number;
  player_id: number;
  point?: number;
  mmr_delta?: number;
  pinalty?: number;
  created_at: Date;
  updated_at: Date;
  player: Player;
}

export type Match = {
  approved_at: Date;
  id: number;
  parlour_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  match_players: Array<MatchPlayer>;
  parlour?: Parlour;
  playing_at: Date;
  creator: Player;
}

export type MatchResponse = {
  message: string;
  list: Array<Match>;
  has_more: boolean;
}

export const getMatches = query(async (paginateRequest: PaginateRequest): Promise<MatchResponse> => {
  "use server";

  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Match>>(`/api/matches?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Match>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "match-paginate");

export const getMatchById = query(async (id: number): Promise<Match|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Match>).data;
}, 'match-detail');

export const deleteMatchById = action(async (id: number): Promise<boolean> => {
  "use server";

  const res = await fetchApi<ResponseData<null>>(`/api/matches/${id}`, {
    method: 'DELETE',
  });

  if (!res.success) {
    return false;
  }

  return true;
}, "player-delete");

export const createMatch = action(async (): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches`, {
    method: 'POST'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Match>).data;
}, "player-create");

export const updateMatch = action(async (id: number): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}`, {
    method: 'PUT'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Match>).data;
}, "player-update");

export const updateMatchPoint = action(async (id: number): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}/point`, {
    method: 'POST'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Match>).data;
}, "player-update");

export const updateMatchApprove = action(async (id: number): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}/approve`, {
    method: 'POST'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Match>).data;
}, "player-update");
