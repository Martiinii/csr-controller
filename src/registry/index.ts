import { Controller, ControllerBase, CRUDBase } from '../';

type ControllerRegistryProps<T, C extends CRUDBase, U extends CRUDBase> = Partial<
	Omit<Controller<T, C, U>, keyof ControllerBase>
>;
/**
 * Allows to register every controller db handler
 *
 * @returns Object with register and handle methods
 */
export const controllerRegistry = () => {
	const routes = new Map<string, Controller<any, any, any>>();

	/**
	 * Register controller with database handlers
	 *
	 * @param c @see {@link Controller}
	 * @param db Database handlers
	 * @returns
	 */
	const register = <T, C extends CRUDBase, U extends CRUDBase>(
		c: Controller<T, C, U>,
		db: ControllerRegistryProps<T, C, U>
	) => {
		routes.set(c.$url, { ...c, ...db });

		return { register, handle };
	};

	/**
	 * Handle and return routes
	 * @returns Registered routes
	 */
	const handle = () => {
		return routes;
	};

	return { register, handle };
};
