/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseControllerMethods, Controller, ControllerMethods, ControllerProps, CRUDBase, SubController } from '../';

type PartialParameter<T extends (...args: unknown[]) => unknown> = Partial<Parameters<T>[0]> extends infer R
	? R extends undefined
		? never
		: R
	: never;
type PartialFunction<T extends (...args: unknown[]) => unknown> = PartialParameter<T> extends infer R
	? (arg0: R) => ReturnType<T>
	: never;

type PickByType<T, Value> = {
	[P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

/**
 * Allows to register every controller database handler
 *
 * @returns Object with register and handle methods
 */
export const controllerRegistry = () => {
	const routes = new Map<string, Controller<unknown, CRUDBase, CRUDBase>>();

	/**
	 * Register controller with database handlers
	 *
	 * @param c @see {@link Controller}
	 * @param db Database handlers for controller and sub controllers
	 * @returns
	 */
	const register = <CONT extends Controller<unknown, CRUDBase, CRUDBase>>(
		c: CONT,
		db: {
			[method in keyof ControllerMethods<unknown, CRUDBase, CRUDBase>]?: PartialFunction<CONT[method]>;
		} & {
			[sk in keyof PickByType<
				Omit<CONT, keyof ControllerMethods<unknown, CRUDBase, CRUDBase> | keyof ControllerProps>,
				ReturnType<SubController<unknown>>
			>]: {
				[k in keyof CONT[sk] & keyof BaseControllerMethods<unknown>]: CONT[sk][k];
			};
		}
	) => {
		const { index, create, destroy, read, update, ...rest } = db;

		const subs = Object.keys(rest).reduce<{ [k: string]: BaseControllerMethods<unknown> }>((p, s) => {
			p[c[s].$url] = rest[s];

			return p;
		}, {} as never);

		routes.set(c.$url, {
			...c,
			index,
			create,
			destroy,
			read,
			update,
			...subs,
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
