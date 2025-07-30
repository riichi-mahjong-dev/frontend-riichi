import { action, query } from "@solidjs/router";
import { ErrorResponse, fetchApi, PaginateRequest, PaginateResponse, ResponseData, toQueryParams } from "./base";
import { Parlour } from "./parlour";

export type AdminPermission = {
  province_id: number;
  parlour_id: number;
  parlour: Parlour;
}

export type Admin = {
  id: number;
  username: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  admin_permission: Array<AdminPermission>;
}

export type AdminResponse = {
  message: string;
  list: Array<Admin>;
  has_more: boolean;
}

export type AdminPermissionInput = {
  province_id: number;
  parlour_id: number;
}

export type AdminRequest = {
  username: string;
  password: string;
  role: string;
  admin_permission: Array<AdminPermissionInput>;
}

export type ChangePasswordPlayer = {
  old_password: string;
  new_password: string;
}

export const getAdmins = query(async (paginateRequest: PaginateRequest): Promise<AdminResponse> => {
  "use server";
  const query = toQueryParams(paginateRequest);
  const res = await fetchApi<PaginateResponse<Admin>>(`/api/admins?${query}`);

  if (!res.success) {
    return {
      message: (res as ErrorResponse).error,
      list: [],
      has_more: false,
    };
  }

  const response = (res as PaginateResponse<Admin>);
  return {
    message: response.message,
    list: response.data,
    has_more: response.meta.has_more,
  };

}, "admin-list");

export const getAdminById = query(async (id: number): Promise<Admin|null> => {
  "use server";

  const res = await fetchApi<ResponseData<Admin>>(`/api/admins/${id}`);

  if (!res.success) {
    return null;
  }

  return (res as ResponseData<Admin>).data;
}, "admin-detail");

export const createAdmin = action(async (body: AdminRequest): Promise<Admin> => {
  "use server";

  const res = await fetchApi<ResponseData<Admin>>(`/api/admins`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Admin>).data;
}, "create-admin");

export const updateAdmin = action(async (id: number, body: AdminRequest): Promise<Admin> => {
  "use server";

  const res = await fetchApi<ResponseData<Admin>>(`/api/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return (res as ResponseData<Admin>).data;
}, "admin-update");

export const updatePasswordAdmin = action(async (body: ChangePasswordPlayer): Promise<boolean> => {
  "use server";

  const res = await fetchApi<ResponseData<boolean>>(`/api/admins/change-password`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.success) {
    throw new Error((res as ErrorResponse).error);
  }

  return true;
}, "admin-change-password");
