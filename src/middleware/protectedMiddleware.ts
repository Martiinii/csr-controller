import { ControllerMiddleware } from '.';
import { notAuthorizedResponse } from '../apiRoutes/response';

export const protectedMiddleware: ControllerMiddleware = c => {
	if (c.$protected) return notAuthorizedResponse;
};
