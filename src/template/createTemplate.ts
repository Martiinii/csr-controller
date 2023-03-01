import { CRUDBase, ControllerMethods, ControllerProps } from '..';

type CreateTemplateData<T, C extends CRUDBase, U extends CRUDBase> = Partial<ControllerMethods<T, C, U>>;

/**
 * Creates template for controllers
 *
 * @param data Function with {@link ControllerBase} parameter that should return all controller methods
 * @returns Template for controllers
 */
export const createTemplate = <D extends CreateTemplateData<unknown, CRUDBase, CRUDBase>>(
	data: (c: ControllerProps) => D
) => {
	return data as <T, C extends CRUDBase, U extends CRUDBase>(c: ControllerProps) => ControllerMethods<T, C, U>;
};
