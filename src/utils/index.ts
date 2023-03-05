import { ControllerProps, CRUDBase, CRUDFetchMethod } from '../';

/**
 * Simple fetcher
 *
 * @param c Controller properties
 * @param method CRUD method, e.g. GET or POST
 * @param data Optional object with data
 * @param server Optional server parameter to use with shared controllers between projects
 * @returns Promise with result from fetch
 *
 * @todo implement server parameter logic
 */
export const fetcher = <T>(
	c: ControllerProps,
	method: (typeof CRUDFetchMethod)[number],
	data?: (object & CRUDBase) | string,
	server?: string
): Promise<T> => {
	// Convert data from object | string to string | null
	const dataId = typeof data === 'string' ? data : data != null ? data.id : null;

	// If using GET, we cannot pass body using fetch. Make sure to delete id so we don't get unnecessary query parameter
	if (typeof data === 'object' && method == 'GET') {
		delete data.id;
		if (Object.keys(data).length == 0) data = undefined;
	}

	/* Create url as:
        /api/[base]/[parentUrl]/[dataId]/[url]
        /api/[base]/[parentUrl]/[url]
        /api/[base]/[url]/[dataId]
        /api/[base]/[url]
    */
	const urlParams = method == 'GET' && data ? `?${new URLSearchParams(data as Record<string, string>)}` : '';
	const url =
		`/api/` +
		(c.$base ? `${c.$base}/` : '') +
		(c.$parentUrl
			? c.$parentUrl + (dataId ? `/${dataId}/` : '/') + c.$url + urlParams
			: `${c.$url}/${dataId ? dataId : ''}` + urlParams);
	// (c.$parentUrl ? `${c.$parentUrl}/${dataId}/${c.$url}` : `${c.$url}/${dataId}`) +
	// (method == 'GET' && data ? '?' + new URLSearchParams(data as Record<string, string>) : '');

	return fetch(url, {
		method,
		body: method !== 'GET' ? JSON.stringify(typeof data === 'string' ? null : data) : null,
	}).then(res => res.json()) as Promise<T>;
};
