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
  playing_at: Date | null;
  creator: Player;
}

export type MatchResponse = {
  message: string;
  list: Array<Match>;
  has_more: boolean;
}

export type PlayerInput = {
  player: number;
}

export type MatchCreate = {
  parlour_id: number;
  players: Array<PlayerInput>;
}

export type PlayerInputUpdate = {
  match_player_id: number;
  player: number;
}

export type MatchUpdate = {
  parlour_id: number;
  players: Array<PlayerInputUpdate>;
}

export type PointMatch = {
  match_player_id: number;
  score: number;
}

export type PointMatchUpdate = {
  point_match_players: Array<PointMatch>;
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
}, "match-delete");

export const createMatch = action(async (body: MatchCreate): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Match>).data;
}, "match-create");

export const updateMatch = action(async (id: number, body: MatchUpdate): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Match>).data;
}, "match-update");

export const updateMatchPoint = action(async (id: number, body: PointMatchUpdate): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}/point`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Match>).data;
}, "match-point-input");

export const updateMatchApprove = action(async (id: number): Promise<Match> => {
  "use server";

  const res = await fetchApi<ResponseData<Match>>(`/api/matches/${id}/approve`, {
    method: 'POST'
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Match>).data;
}, "match-approve");
