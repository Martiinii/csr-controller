import { ControllerMiddleware } from '.';

export const debugMiddleware: ControllerMiddleware = c => {
	console.log(c);
	return null;
};
