import { createTemplate } from './templates/createTemplate';

export const CRUDFetchMethod = ['GET', 'POST', 'PATCH', 'DELETE'] as const;
export type CRUDBase = {
	id: string | number;
};

/**
 * @param $url Controller API route
 * @param $base Path to directory with API routes
 * @param $protected Optional parameter to define if route is protected (must define own logic as middleware)
 */
export type ControllerBase = {
	$url: string;
	$base?: string;
	$protected?: boolean;
};

export type Controller<T, C extends CRUDBase, U extends CRUDBase> = {
	create?: (data: C) => Promise<T>;
	index?: () => Promise<T[]>;
	read?: (data: CRUDBase) => Promise<T>;
	update?: (data: U) => Promise<T>;
	destroy?: (data: CRUDBase) => Promise<T>;
} & ControllerBase;

export type ControllerMethods<T, C extends CRUDBase, U extends CRUDBase> = Required<
	Omit<Controller<T, C, U>, keyof ControllerBase>
>;

/**
 * Create controller
 *
 * @param options {@link ControllerBase | Configuration object} for the controller
 * @returns Function to provide template
 */
export const createController =
	<T, C extends CRUDBase, U extends CRUDBase>({ $url, $base = 'custom', $protected = true }: ControllerBase) =>
	/**
	 * Function to provide template
	 *
	 * @param template Template to use for this controller
	 * @returns Controller
	 */
	(template: ReturnType<typeof createTemplate>) => {
		return {
			$url,
			$base,
			$protected,

			...template<T, C, U>({ $url, $base, $protected }),
		};
	};
