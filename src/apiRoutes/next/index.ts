import { NextApiRequest, NextApiResponse } from 'next';
import { APIErrorResponse, APIFullErrorResponse, controllerNotFound, unimplementedMethodResponse } from '../response';
import { getHandler } from '../handler';
import { ControllerMiddleware } from '../../middleware';
import { Controller } from '../..';

/**
 * Default Next API route to use with controllers
 *
 * @param args Routes made with controllerRegistry
 */
export const withNextRoute = (args: Map<string, Controller<any, any, any>>, ...middlewares: ControllerMiddleware[]) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method.toUpperCase();
		const nextcontroller = req.query.nextcontroller as string[];

		// If the route is not found in map there is no controller defined
		if (!args.has(nextcontroller.at(0)))
			return apiErrorResponse(req, res, controllerNotFound(nextcontroller.at(0)));

		const controller = args.get(nextcontroller.at(0));

		// Get handler method from controller based on the request method
		const handler = getHandler(method, nextcontroller, controller);

		// If the handler is not implemented
		if (handler == null) {
			return apiErrorResponse(req, res, unimplementedMethodResponse);
		}

		// Run every middleware in sequence. If any fails, return error response
		for (const middleware of middlewares) {
			const middlewareResponse = await middleware(controller);

			if (middlewareResponse != null) {
				return apiErrorResponse(req, res, middlewareResponse);
			}
		}

		const result = await handler(req.body);
		res.status(200).json(result);
	};
};

const apiErrorResponse = (req: NextApiRequest, res: NextApiResponse<APIErrorResponse>, msg: APIFullErrorResponse) => {
	res.status(msg.status).json({ error: msg.error });
};
