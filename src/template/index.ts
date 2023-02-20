import { CRUDBase, ControllerBase, ControllerMethods } from '..';
type CreateTemplateData<T, C extends CRUDBase, U extends CRUDBase> = ControllerMethods<T, C, U>;

/**
 * Creates template for controllers
 *
 * @param data Function with {@link ControllerBase} parameter that should return all controller methods
 * @returns Template for controllers
 */
export const createTemplate = <D extends CreateTemplateData<any, any, any>>(data: (c: ControllerBase) => D) => {
	return data as <T, C extends CRUDBase, U extends CRUDBase>(
		c: ControllerBase
	) => CreateTemplateData<T, C, U> & Omit<D, keyof CreateTemplateData<T, C, U>>;
};

export * from './crudTemplate';
