/* eslint-disable @typescript-eslint/no-empty-interface */

import { createTemplate } from './template';

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
export type BaseControllerMethods<T> = {
	read: (data: CRUDBase) => Promise<T | Record<string, never>>;
};
export type ControllerMethods<T, C, U> = {
	create: (data: C) => Promise<T | Record<string, never>>;
	index: () => Promise<T[]>;
	update: (data: U) => Promise<T | Record<string, never>>;
	destroy: (data: CRUDBase) => Promise<T | Record<string, never>>;
} & BaseControllerMethods<T>;

// Main types
export type Controller<T, C extends CRUDBase, U extends CRUDBase> = ControllerMethods<T, C, U> & ControllerProps;
export type SubController<T> = (c: ControllerProps) => BaseControllerMethods<T> & SharedControllerProps;

type ControllerReturnType<T, C extends CRUDBase, U extends CRUDBase, SUB> = Controller<T, C, U> & SUB;
type SubControllerReturnType<T> = ReturnType<SubController<T>> & DefaultControllerProps;
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
	return <ST extends { [k: string]: SubController<unknown> }, K extends keyof ST>(
		template: ReturnType<typeof createTemplate>,
		sc?: ST
	) => {
		const subs = Object.keys(sc).reduce<{ [k in K]: ReturnType<ST[k]> }>((p, c) => {
			p[c] = sc[c](data);
			return p;
		}, {} as never);

		return {
			...data,
			...template<T, C, U>(data),
			...subs,
		} as ControllerReturnType<T, C, U, { [k in K]: ReturnType<ST[k]> }>;
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
		 * @returns Subcontroller
		 */
		return (c: ControllerProps) => {
			const { $protected, $url: $parentUrl, $base } = c;
			return {
				$base,
				$protected,
				$parentUrl,
				...data,

				read: template<T, CRUDBase, CRUDBase>({ ...c, $base, $protected, $parentUrl, ...data }).read,
			} as SubControllerReturnType<T>;
		};
	};
};
