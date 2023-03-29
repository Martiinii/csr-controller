import { CRUDBase, ControllerMethods, ControllerProps } from '..';

type CreateTemplateData<T, C, U extends CRUDBase> = Partial<
	Omit<ControllerMethods<T, C, U>, '$changeServer' | '$clone'>
>;
export type TemplateReturn<T, C, U extends CRUDBase> = (
	c: ControllerProps
) => Omit<ControllerMethods<T, C, U>, '$changeServer' | '$clone'>;

/**
 * Creates template for controllers
 *
 * @param data Function with {@link ControllerProps} parameter that should return all controller methods
 * @returns Template for controllers
 */
export const createTemplate = (data: (c: ControllerProps) => CreateTemplateData<unknown, never, never>) => {
	return data as <T, C, U extends CRUDBase, ISARR = true>(
		c: ControllerProps
	) => Omit<ControllerMethods<T, C, U, ISARR>, '$changeServer' | '$clone'>;
};
