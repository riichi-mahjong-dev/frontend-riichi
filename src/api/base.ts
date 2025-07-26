import { getSessionUser } from "~/lib/auth/session";

export type PaginateRequest = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  filter?: {[key:string]:string};
}

export function toQueryParams(req: PaginateRequest): string {
  const params = new URLSearchParams();

  params.set("page[number]", (req.page ?? 1).toString());
  params.set("page[size]", (req.pageSize ?? 10).toString());
  params.set("search", req.search ?? '');
  params.set("sort", req.sort ?? '-id');

  for (const key in req.filter) {
    if (Object.prototype.hasOwnProperty.call(req.filter, key)) {
      params.set(`filter[${key}]`, req.filter[key]);
    }
  }

  return params.toString();
}

export type PaginateMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_more: boolean;
}

export type ResponseData<T> = {
  success: boolean;
  message: string;
  data: T;
}

export type PaginateResponse<T> = {
  success: boolean;
  message: string;
  data: Array<T>;
  meta: PaginateMeta;
}

export type ErrorResponse = {
  success: boolean;
  message: string;
  error: string;
}

export type ApiResponse<T = unknown> = | ErrorResponse | T;
export type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

export async function fetchApi<T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> {
  try {
    const host = import.meta.env.VITE_BACKEND_HOST;

    const session = await getSessionUser();

    const headers: Record<string, any> = {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    };

    if (session) {
      headers['Authorization'] = `${session.token_type} ${session.access_token}`;
    }

    const response = await fetch(host + url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return body as ErrorResponse;
    }

    return body as T;
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Internal Server Error',
      error: (error as Error).message || 'Network error',
    }
  }
}
