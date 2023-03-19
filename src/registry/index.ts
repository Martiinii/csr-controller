import { BaseControllerMethods, Controller, ControllerMethods, ControllerProps, CRUDBase, SubController } from '../';

type PickByType<T, Value> = {
	[P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

type RegisterFunction = <CONT extends Controller<unknown, never, never>>(
	controller: CONT,
	db: {
		[method in keyof Omit<ControllerMethods<unknown, never, never>, '$changeServer' | '$clone'>]?: CONT[method];
	} & {
		[sk in keyof PickByType<
			Omit<CONT, keyof ControllerMethods<unknown, never, never> | keyof ControllerProps>,
			ReturnType<SubController<unknown>>
		>]: {
			[k in keyof CONT[sk] & keyof BaseControllerMethods<unknown>]?: CONT[sk][k];
		};
	}
) => {
	register: RegisterFunction;
	handle: () => Map<string, Controller<unknown, unknown, CRUDBase>>;
};

/**
 * Allows to register every controller database handler
 *
 * @returns Object with register and handle methods
 */
export const controllerRegistry = () => {
	const routes = new Map<string, Controller<unknown, unknown, CRUDBase>>();

	/**
	 * Register controller with database handlers
	 *
	 * @param controller
	 * @param db Database handlers for controller and sub controllers
	 *
	 *  @see {@link Controller}
	 */
	const register: RegisterFunction = (controller, db) => {
		const { index, create, destroy, read, update, ...rest } = db;
		// Create copy of controller so we won't delete original keys later
		const copy = { ...controller };

		Object.keys(rest).forEach(k => {
			// Remap properties
			const { index, read } = rest[k];
			copy[k] = { ...copy[k], ...rest[k], index, read };

			// Remap key name
			delete Object.assign(copy, { [copy[k].$url]: copy[k] })[k];
		});

		routes.set(copy.$url, {
			...copy,
			index,
			create,
			destroy,
			read,
			update,
		});

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
