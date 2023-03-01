/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseControllerMethods, Controller, ControllerMethods, ControllerProps, CRUDBase } from '../';

type PartialParameter<T extends (...args: unknown[]) => unknown> = Partial<Parameters<T>[0]> extends infer R
	? R extends undefined
		? never
		: R
	: never;
type PartialFunction<T extends (...args: unknown[]) => unknown> = PartialParameter<T> extends infer R
	? (arg0: R) => ReturnType<T>
	: never;

/**
 * Allows to register every controller db handler
 *
 * @returns Object with register and handle methods
 */
export const controllerRegistry = () => {
	const routes = new Map<string, Controller<unknown, CRUDBase, CRUDBase>>();

	/**
	 * Register controller with database handlers
	 *
	 * @param c @see {@link Controller}
	 * @param db Database handlers
	 * @returns
	 */
	const register = <CONT extends Controller<unknown, CRUDBase, CRUDBase>>(
		c: CONT,
		db: {
			[method in keyof ControllerMethods<unknown, CRUDBase, CRUDBase>]?: PartialFunction<CONT[method]>;
		} & {
			[subs in keyof Omit<CONT, keyof ControllerMethods<unknown, CRUDBase, CRUDBase> | keyof ControllerProps>]: {
				// @ts-ignore
				[k in keyof CONT[subs] & keyof BaseControllerMethods<unknown>]: PartialFunction<CONT[subs][k]>;
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
