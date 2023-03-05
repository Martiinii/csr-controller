import { CRUDBase, ControllerMethods, ControllerProps } from '..';

type CreateTemplateData<T, C extends CRUDBase, U extends CRUDBase> = Partial<ControllerMethods<T, C, U>>;
export type TemplateReturn<T, C extends CRUDBase, U extends CRUDBase> = (
	c: ControllerProps
) => ControllerMethods<T, C, U>;

/**
 * Creates template for controllers
 *
 * @param data Function with {@link ControllerProps} parameter that should return all controller methods
 * @returns Template for controllers
 */
export const createTemplate = (data: (c: ControllerProps) => CreateTemplateData<unknown, CRUDBase, CRUDBase>) => {
	return data as <T, C extends CRUDBase, U extends CRUDBase, ISARR = true>(
		c: ControllerProps
	) => ControllerMethods<T, C, U, ISARR>;
};
