import { action, query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";

export type Post = {
  id: number;
  title: string;
  content: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  slug: string;
}

export type PlayerResponse = {
  message: string;
  list: Array<Post>;
  has_more: boolean;
}

export const getPlayers = query(async (paginateRequest: PaginateRequest): Promise<PlayerResponse> => {
  "use server";
  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Post>>(`/api/posts?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Post>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };
}, "post-list");

export const getPlayerById = query(async (id: number): Promise<Post|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Post>>(`/api/posts/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Post>).data;
}, 'post-detail');

export const deletePlayerById = action(async (id: number): Promise<boolean> => {
  "use server";

  const res = await fetchApi<ResponseData<null>>(`/api/posts/${id}`, {
    method: 'DELETE',
  });

  if (!res.success) {
    return false;
  }

  return true;
}, "post-delete");

export const createPlayer = action(async (): Promise<Post> => {
  "use server";

  const res = await fetchApi<ResponseData<Post>>(`/api/posts`, {
    method: 'POST'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Post>).data;
}, "post-create");

export const updatePlayer = action(async (id: number): Promise<Post> => {
  "use server";

  const res = await fetchApi<ResponseData<Post>>(`/api/posts/${id}`, {
    method: 'PUT'
  });

  if (!res.success) {
    
  }

  return (res as ResponseData<Post>).data;
}, "post-update");
