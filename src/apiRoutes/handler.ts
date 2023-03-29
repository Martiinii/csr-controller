import { CRUDBase, CRUDFetchMethod, Controller } from '../';
/**
 * Gets handler method from controller based on provided controller and data
 *
 * @param method CRUD method
 * @param slug Request slug parameter
 * @param c Controller
 * @returns Handler method or null if method was not found
 */
export const getHandler = <T, C, U extends CRUDBase>(
	method: string,
	slug: (string | number)[],
	c: Controller<T, C, U> | undefined
) => {
	if (c == null) return null;

	switch (method as (typeof CRUDFetchMethod)[number]) {
		case 'POST': {
			return c?.create;
		}
		case 'GET': {
			if (slug.at(1)) return c?.read;
			return c?.index;
		}
		case 'PATCH': {
			if (slug.at(1)) return c?.update;
			break;
		}
		case 'DELETE': {
			if (slug.at(1)) return c?.destroy;
			break;
		}
		default: {
			return null;
		}
	}
};
