/* eslint-disable @typescript-eslint/no-empty-interface */

import { TemplateReturn, createTemplate } from './template';

export const CRUDFetchMethod = ['GET', 'POST', 'PATCH', 'DELETE'] as const;
export interface DefaultCRUDBase {
	id: string | number;
}
export interface CRUDBase extends DefaultCRUDBase {}

/**
 * @param $url Controller API route
 * @param $protected Optional parameter to define if route is protected (must define own logic as middleware)
 * @param $parentUrl Optional parameter used by sub controllers
 */
// Shared props between controller and sub controllers
export interface DefaultSharedControllerProps {
	$url: string;
	$protected?: boolean;
	$parentUrl?: string;
}
export interface DefaultControllerProps extends SharedControllerProps {
	$base?: string;
}

// Types made for augmentation
export interface SharedControllerProps extends DefaultSharedControllerProps {}
export interface ControllerProps extends DefaultControllerProps {}

// Methods
export type BaseControllerMethods<T, ISARR = true> = {
	index: () => Promise<ISARR extends true ? T[] : T>;
	read: (data: CRUDBase) => Promise<T | Record<string, never>>;
};
export type ControllerMethods<T, C extends CRUDBase, U extends CRUDBase, ISARR = true> = {
	create: (data: C) => Promise<T | Record<string, never>>;
	update: (data: U) => Promise<T | Record<string, never>>;
	destroy: (data: CRUDBase) => Promise<T | Record<string, never>>;
} & BaseControllerMethods<T, ISARR>;

// Main types
export type Controller<T, C extends CRUDBase, U extends CRUDBase> = ControllerMethods<T, C, U> & ControllerProps;
export type SubController<T> = (c: ControllerProps) => BaseControllerMethods<T, false> & SharedControllerProps;

type ControllerReturnType<T, C extends CRUDBase, U extends CRUDBase, SUB, MET> = Controller<T, C, U> & SUB & MET;
type SubControllerReturnType<T> = ReturnType<SubController<T>> & ControllerProps;
/**
 * Create controller
 *
 * @param data {@link ControllerProps | Configuration object} for the controller
 * @returns Function to provide template
 */
export const createController = <T, C extends CRUDBase, U extends CRUDBase>(data: ControllerProps) => {
	data.$base ??= 'custom';
	data.$protected ??= true;

	/**
	 * Function to provide template
	 *
	 * @param template Template to use for this controller
	 * @param sc Array of subcontrollers
	 * @returns Controller
	 */

	//  TODO need to give proper generic type to create template

	return <TEMPL extends TemplateReturn<T, C, U>>(template: TEMPL) => {
		return <
			G,
			ST extends { [k: string]: SubController<unknown> },
			KS extends keyof ST,
			M extends { [k: string]: (t: ReturnType<TemplateReturn<T, C, U>>) => (data: never) => G },
			KM extends keyof M
		>(config?: {
			subcontrollers?: ST;
			methods?: M;
		}) => {
			// Default values
			config ??= {};
			config.subcontrollers ??= {} as never;
			config.methods ??= {} as never;

			const subs = Object.keys(config.subcontrollers).reduce<{ [k in KS]: ReturnType<ST[k]> }>((p, c) => {
				p[c] = config.subcontrollers[c](data);
				return p;
			}, {} as never);

			const mets = Object.keys(config.methods).reduce<{ [k in KM]: ReturnType<M[k]> }>((p, c) => {
				p[c] = config.methods[c](template(data));
				return p;
			}, {} as never);

			return {
				...data,
				...template(data),
				...subs,
				...mets,
			} as ControllerReturnType<T, C, U, { [k in KS]: ReturnType<ST[k]> }, { [k in KM]: ReturnType<M[k]> }>;
		};
	};
};

/**
 * Create subcontroller
 *
 * @param data Configuration object for the subcontroller
 * @returns
 */
export const createSubController = <T>(data: Omit<SharedControllerProps, '$parentUrl' | '$protected'>) => {
	/**
	 * Function to provide template
	 *
	 * @param template Template to use for this subcontroller
	 * @returns Function to provide parent controller props
	 */
	return (template: ReturnType<typeof createTemplate>) => {
		/**
		 * Function to provide parent controller props
		 *
		 * @param c ControllerProps
		 * @returns Subcontrollers
		 */
		return (c: ControllerProps) => {
			const { $protected, $url: $parentUrl, $base } = c;
			const { read, index } = template<T, CRUDBase, CRUDBase, false>({
				...c,
				$base,
				$protected,
				$parentUrl,
				...data,
			});

			return {
				...c,
				$parentUrl,
				...data,

				read,
				index,
			} as SubControllerReturnType<T>;
		};
	};
};
