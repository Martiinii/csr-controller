import { CRUDFetchMethod } from '../';

/**
 * Simple fetcher
 *
 * @param resource API path
 * @param method CRUD method, e.g. GET or POST
 * @param data Optional object with data
 * @returns Promise with result from fetch
 */
export const fetcher = <T>(
	resource: string,
	method: (typeof CRUDFetchMethod)[number],
	data?: object | string
): Promise<T> => {
	return fetch(typeof data === 'string' ? new URL(data, resource) : resource, {
		method,
		body: JSON.stringify(typeof data === 'string' ? null : data),
	}).then(res => res.json()) as Promise<T>;
};
