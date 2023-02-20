import { APIFullErrorResponse } from '../apiRoutes/response';
import { Controller } from '../';

export type ControllerMiddleware = (
	c: Controller<any, any, any>
) => APIFullErrorResponse | undefined | Promise<APIFullErrorResponse | undefined>;
