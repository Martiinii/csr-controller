import { APIFullErrorResponse } from '../apiRoutes/response';
import { Controller } from '../controller/createController';

export type ControllerMiddleware = (
	c: Controller<any, any, any>
) => APIFullErrorResponse | undefined | Promise<APIFullErrorResponse | undefined>;
