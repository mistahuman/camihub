import type { PageLoad } from './$types';
import { createExampleItemsApi } from '$lib/api/client';

export const prerender = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const items = await createExampleItemsApi(fetch).list();
		return { items, apiError: null };
	} catch (e) {
		// The starter has to build and host on its own, with no backend paired yet.
		return { items: [], apiError: e instanceof Error ? e.message : String(e) };
	}
};
