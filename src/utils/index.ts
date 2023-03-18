import { IpcRenderer } from 'electron';
import { ControllerProps, CRUDBase, CRUDFetchMethod } from '../';

/**
 * Simple fetcher
 *
 * @param c Controller properties
 * @param method CRUD method, e.g. GET or POST
 * @param data Optional object with data
 * @returns Promise with result from fetch
 */
export const fetcher = async <T>(
	c: ControllerProps,
	method: (typeof CRUDFetchMethod)[number],
	data?: (object & CRUDBase) | string
): Promise<T> => {
	// Convert data from object | string to string | null
	const dataId = typeof data === 'string' ? data : data != null ? data.id : null;
	const server = c.$server ?? '';

	// If using GET, we cannot pass body using fetch. Make sure to delete id so we don't get unnecessary query parameter
	if (typeof data === 'object' && method == 'GET') {
		delete data.id;
		if (Object.keys(data).length == 0) data = undefined;
	}

	/* Create url as:
        [server]/api/[base]/[parentUrl]/[dataId]/[url]
        [server]/api/[base]/[parentUrl]/[url]
        [server]/api/[base]/[url]/[dataId]
        [server]/api/[base]/[url]
    */
	const urlParams = method == 'GET' && data ? `?${new URLSearchParams(data as Record<string, string>)}` : '';
	const url =
		`${server}/api/` +
		(c.$base ? `${c.$base}/` : '') +
		(c.$parentUrl
			? c.$parentUrl + (dataId ? `/${dataId}/` : '/') + c.$url + urlParams
			: `${c.$url}/${dataId ? dataId : ''}` + urlParams);
	// (c.$parentUrl ? `${c.$parentUrl}/${dataId}/${c.$url}` : `${c.$url}/${dataId}`) +
	// (method == 'GET' && data ? '?' + new URLSearchParams(data as Record<string, string>) : '');

	const res = await fetch(url, {
		method,
		body: method !== 'GET' ? JSON.stringify(typeof data === 'string' ? null : data) : null,
	});

	if (!res.ok) {
		const error = new Error('An error occured while fetching the data.');
		error.message = (await res.json())?.error ?? 'Undefined error';

		throw error;
	}

	return (await res.json()) as Promise<T>;
};

/**
 * Electron ipc invoker
 *
 * @param ipcRenderer ipcRenderer from electron
 * @param c Controller
 * @param method CRUD method, e.g. GET or POST
 * @param data Optional object with data
 * @returns Promise with result from ipcInvoke
 */
export const ipcInvoker = <T>(
	ipcRenderer: IpcRenderer,
	c: ControllerProps,
	method: (typeof CRUDFetchMethod)[number],
	data?: object & CRUDBase
): Promise<T> => {
	return ipcRenderer.invoke('csr-controller', c, method, data) as Promise<T>;
};
