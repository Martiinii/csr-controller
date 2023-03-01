import { fetcher } from '../utils';
import { createTemplate } from './createTemplate';

/**
 * Simple CRUD template that utilizes all methods
 *
 * @see {@link createTemplate}
 */
export const crudTemplate = createTemplate(c => ({
	create: data => fetcher(c, 'POST', data),

	index: () => fetcher(c, 'GET'),
	read: data => fetcher(c, 'GET', data),

	update: data => fetcher(c, 'PATCH', data),

	destroy: data => fetcher(c, 'DELETE', data),
}));
