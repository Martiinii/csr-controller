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
	$server?: string;
}

// Types made for augmentation
export interface SharedControllerProps extends DefaultSharedControllerProps {}
export interface ControllerProps extends DefaultControllerProps {}

// Methods
export type BaseControllerMethods<T, ISARR = true> = {
	index: () => Promise<ISARR extends true ? T[] : T>;
	read: (data: CRUDBase) => Promise<T | Record<string, never>>;
};
export type ControllerMethods<T, C, U extends CRUDBase, ISARR = true> = {
	create: (data: C) => Promise<T | Record<string, never>>;
	update: (data: U) => Promise<T | Record<string, never>>;
	destroy: (data: CRUDBase) => Promise<T | Record<string, never>>;

	$changeServer: (server: string) => never;
	$clone: (template: TemplateReturn<T, C, U>) => never;
} & BaseControllerMethods<T, ISARR>;

// Main types
export type Controller<T, C, U extends CRUDBase> = ControllerMethods<T, C, U> & ControllerProps;
export type SubController<T> = (c: ControllerProps) => BaseControllerMethods<T, false> & SharedControllerProps;

export type ControllerReturnType<T, C, U extends CRUDBase, SUB, MET> = Controller<T, C, U> & SUB & MET;
type SubControllerReturnType<T> = ReturnType<SubController<T>> & ControllerProps;

/**
 * Create controller
 *
 * @param data {@link ControllerProps | Configuration object} for the controller
 * @returns Function to provide template
 */
export const createController = <T, C, U extends CRUDBase>(data: ControllerProps) => {
	data.$base ??= 'custom';
	data.$server ??= '';
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
			ST extends { [k: string]: (t: ReturnType<typeof createTemplate>) => SubController<unknown> },
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

			const subs = Object.keys(config.subcontrollers).reduce<{ [k in KS]: SubControllerReturnType<unknown> }>(
				(p, c) => {
					p[c as KS] = config.subcontrollers[c](template as never)(data);
					return p;
				},
				{} as never
			);

			const mets = Object.keys(config.methods).reduce<{ [k in KM]: ReturnType<M[k]> }>((p, c) => {
				p[c] = config.methods[c](template(data));
				return p;
			}, {} as never);

			// Function to change server for controller and subcontrollers
			const $changeServer = (server: string) => {
				data.$server = server;

				// Change each subcontroller $server and update template methods
				Object.keys(subs).forEach(k => {
					subs[k as KS] = { ...config.subcontrollers[k](template as never)(data), $server: server };
				});

				// Change each method template
				Object.keys(mets).forEach(k => {
					mets[k as KM] = config.methods[k](template(data)) as never;
				});

				return {
					...data,
					...template(data),
					...subs,
					...mets,
					$changeServer,
					$clone,
				} as ControllerReturnType<
					T,
					C,
					U,
					KS extends never ? object : { [k in KS]: ReturnType<ReturnType<ST[k]>> },
					KM extends never ? object : { [k in KM]: ReturnType<M[k]> }
				>;
			};

			// Function to clone controller with new template
			const $clone = (t: TEMPL) => {
				template = t;

				// Change each subcontroller template
				Object.keys(subs).forEach(k => {
					subs[k as KS] = { ...config.subcontrollers[k](t as never)(data) };
				});
				const res = {
					...data,
					...subs,
					...mets,
					...t(data),
					$changeServer,
					$clone,
				} as ControllerReturnType<
					T,
					C,
					U,
					KS extends never ? object : { [k in KS]: ReturnType<ReturnType<ST[k]>> },
					KM extends never ? object : { [k in KM]: ReturnType<M[k]> }
				>;

				return res;
			};

			return {
				...data,
				...template(data),
				...subs,
				...mets,
				$changeServer,
				$clone,
			} as ControllerReturnType<
				T,
				C,
				U,
				KS extends never ? object : { [k in KS]: ReturnType<ReturnType<ST[k]>> },
				KM extends never ? object : { [k in KM]: ReturnType<M[k]> }
			>;
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
			const { read, index } = template<T, unknown, CRUDBase, false>({
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
