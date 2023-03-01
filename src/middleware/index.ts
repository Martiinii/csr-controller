import { APIFullErrorResponse } from '../apiRoutes/response';
import { Controller, CRUDBase } from '../';

export type ControllerMiddleware = (
	c: Controller<unknown, CRUDBase, CRUDBase>
) => APIFullErrorResponse | undefined | Promise<APIFullErrorResponse | undefined>;

export * from './debugMiddleware';
