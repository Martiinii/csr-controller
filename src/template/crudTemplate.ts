import { fetcher } from '../utils';
import { createTemplate } from './createTemplate';

/**
 * Simple CRUD template that utilizes all methods
 *
 * @see {@link createTemplate}
 */
export const crudTemplate = (f?: typeof fetch) => {
	f ??= fetch;

	return createTemplate(c => ({
		create: data => fetcher(f, c, 'POST', data),

		index: () => fetcher(f, c, 'GET'),
		read: data => fetcher(f, c, 'GET', data),

		update: data => fetcher(f, c, 'PATCH', data),

		destroy: data => fetcher(f, c, 'DELETE', data),
	}));
};
