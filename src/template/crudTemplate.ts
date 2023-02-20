import { fetcher } from '../utils';
import { createTemplate } from './';

/**
 * Simple CRUD template that utilizes all methods
 *
 * @see {@link createTemplate}
 */
export const crudTemplate = createTemplate(c => ({
	create: data => fetcher(c.$url, 'POST', data),

	index: () => fetcher(c.$url, 'GET'),
	read: data => fetcher(c.$url, 'GET', data),

	update: data => fetcher(c.$url, 'PATCH', data),

	destroy: data => fetcher(c.$url, 'DELETE', data),
}));
