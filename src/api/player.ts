import { action, query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateMeta, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";
import { Province } from "./province";

export type Player = {
  id: number;
  province_id: number;
  rank: number;
  name: string;
  country: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  province: Province;
}

export type PlayerResponse = {
  message: string;
  list: Array<Player>;
  has_more: boolean;
}

export const getPlayers = query(async (paginateRequest: PaginateRequest): Promise<PlayerResponse> => {
  "use server";
  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Player>>(`/api/players?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Player>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "player-list");

export const getPlayerById = query(async (id: number): Promise<Player|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Player>>(`/api/players/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Player>).data;
}, 'player-detail');

export const deletePlayerById = action(async (id: number): Promise<boolean> => {
  "use server";

  const res = await fetchApi<ResponseData<null>>(`/api/players/${id}`, {
    method: 'DELETE',
  });

  if (!res.success) {
    return false;
  }

  return true;
}, "player-delete");

export const createPlayer = action(async (): Promise<Player> => {
  "use server";

  const res = await fetchApi<ResponseData<Player>>(`/api/players`, {
    method: 'POST'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Player>).data;
}, "player-create");

export const updatePlayer = action(async (id: number): Promise<Player> => {
  "use server";

  const res = await fetchApi<ResponseData<Player>>(`/api/players/${id}`, {
    method: 'PUT'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Player>).data;
}, "player-update");
