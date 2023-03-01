import { ControllerMiddleware } from '.';

/**
 * Simple middleware to debug current controller
 */
export const debugMiddleware: ControllerMiddleware = c => {
	console.log(c);
	return null;
};
