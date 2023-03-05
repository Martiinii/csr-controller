import { CRUDBase, ControllerMethods, ControllerProps } from '..';

type CreateTemplateData<T, C extends CRUDBase, U extends CRUDBase> = Partial<
	Omit<ControllerMethods<T, C, U>, 'changeServer'>
>;
export type TemplateReturn<T, C extends CRUDBase, U extends CRUDBase> = (
	c: ControllerProps
) => Omit<ControllerMethods<T, C, U>, 'changeServer'>;

/**
 * Creates template for controllers
 *
 * @param data Function with {@link ControllerProps} parameter that should return all controller methods
 * @returns Template for controllers
 */
export const createTemplate = (data: (c: ControllerProps) => CreateTemplateData<unknown, CRUDBase, CRUDBase>) => {
	return data as <T, C extends CRUDBase, U extends CRUDBase, ISARR = true>(
		c: ControllerProps
	) => Omit<ControllerMethods<T, C, U, ISARR>, 'changeServer'>;
};
