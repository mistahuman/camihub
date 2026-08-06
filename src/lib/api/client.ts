const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface ExampleItem {
	id: string;
	title: string;
	value: number;
	code: string;
	description?: string;
}

export interface CreateExampleItem {
	title: string;
	value: number;
	code: string;
	description?: string;
}

export interface UpdateExampleItem {
	title?: string;
	value?: number;
	code?: string;
	description?: string;
}

type FetchFn = typeof fetch;

async function request<T>(path: string, init?: RequestInit, fetchFn: FetchFn = fetch): Promise<T> {
	const res = await fetchFn(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...init?.headers },
		...init
	});
	if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
	if (res.status === 204) return undefined as T;
	return res.json();
}

export function createExampleItemsApi(fetchFn?: FetchFn) {
	return {
		list: () => request<ExampleItem[]>('/exampleitems/', undefined, fetchFn),
		get: (id: string) => request<ExampleItem>(`/exampleitems/${id}`, undefined, fetchFn),
		create: (payload: CreateExampleItem) =>
			request<ExampleItem>('/exampleitems/', { method: 'POST', body: JSON.stringify(payload) }, fetchFn),
		update: (id: string, payload: UpdateExampleItem) =>
			request<ExampleItem>(`/exampleitems/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, fetchFn),
		delete: (id: string) => request<void>(`/exampleitems/${id}`, { method: 'DELETE' }, fetchFn)
	};
}

export const exampleItemsApi = createExampleItemsApi();
