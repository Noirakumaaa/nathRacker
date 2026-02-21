import type { RootState } from "redux/store";
import { store } from "redux/store";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const fetchRequest = async <T>(
  url: string,
  method: HttpMethod,
  body?: any,
): Promise<T> => {
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || 'Request failed');
  }

  const data: T = text ? JSON.parse(text) : {} as T;
  return data;
}

export const get = <T>(url: string) => fetchRequest<T>(url, 'GET');
export const post = <T>(url: string, body: any) => fetchRequest<T>(url, 'POST', body);
export const put = <T>(url: string, body: any) => fetchRequest<T>(url, 'PUT', body);
export const del = <T>(url: string) => fetchRequest<T>(url, 'DELETE');
