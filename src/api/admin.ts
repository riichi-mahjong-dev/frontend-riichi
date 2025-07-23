import { action, query } from "@solidjs/router";
import { ErrorResponse, PaginateResponse, ResponseData } from "./base";

export type AdminPermission = {
  province_id: number;
  parlour_id: number;
}

export type AdminResponse = {
  id: number;
  username: string;
  role: string;
  admin_permission: Array<AdminPermission>;
  created_at: Date;
  updated_at: Date;
}

export type AdminRequest = {
  username: string;
  password: string;
  role: string;
  admin_permission: Array<AdminPermission>;
}

export const getAdmins = query(async (): Promise<ErrorResponse | PaginateResponse<AdminResponse>> => {
  "use server";

  const res = await fetch("");

  if (!res.ok) {
    return await res.json() as ErrorResponse;
  }
  
  return await res.json() as PaginateResponse<AdminResponse>;
}, "admin-list");

export const getAdmin = query(async (): Promise<ErrorResponse | ResponseData<AdminResponse>> => {
  "use server";

  const res = await fetch("");

  if (!res.ok) {
    return await res.json() as ErrorResponse;
  }

  return await res.json() as ResponseData<AdminResponse>;
}, "admin-detail");

export const createAdmin = action(async (): Promise<ErrorResponse | ResponseData<AdminResponse>> => {
  "use server";

  const res = await fetch("");

  if (!res.ok) {
    return await res.json() as ErrorResponse;
  }

  return await res.json() as ResponseData<AdminResponse>;
}, "create-admin");
