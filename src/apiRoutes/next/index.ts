import { NextApiRequest, NextApiResponse } from 'next';
import {
	APIErrorResponse,
	APIFullErrorResponse,
	controllerNotFound,
	subControllerNotFound,
	unimplementedMethodResponse,
} from '../response';
import { getHandler } from '../handler';
import { ControllerMiddleware } from '../../middleware';
import { Controller, CRUDBase } from '../..';

/**
 * Default Next API route to use with controllers
 *
 * @param args Routes made with controllerRegistry
 * @param middlewares Array of middlewares to execute (in order)
 */
export const withNextRoute = (
	args: Map<string, Controller<unknown, CRUDBase, CRUDBase>>,
	...middlewares: ControllerMiddleware[]
) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method.toUpperCase();
		const { nextcontroller, ...query } = req.query;

		// If the route is not found in map there is no controller defined
		if (!args.has(nextcontroller.at(0)))
			return apiErrorResponse(req, res, controllerNotFound(nextcontroller.at(0)));

		let controller = args.get(nextcontroller.at(0));

		// Use sub controller?
		if (nextcontroller.at(2)) {
			if (!controller[nextcontroller.at(2)])
				return apiErrorResponse(req, res, subControllerNotFound(nextcontroller.at(2)));

			controller = controller[nextcontroller.at(2)];
		} else if (nextcontroller.length == 2 && controller[nextcontroller.at(1)]) {
			controller = controller[nextcontroller.at(1)];
			(nextcontroller as string[]).pop(); // Pop last item so getHandler doesn't confuse it with 'read'
		}

		// Get handler method from controller based on the request method
		const handler = getHandler(method, nextcontroller as string[], controller);

		// If the handler is not implemented
		if (handler == null) {
			return apiErrorResponse(req, res, unimplementedMethodResponse);
		}

		// Run every middleware in sequence. If any fails, return error response
		for (const middleware of middlewares) {
			const middlewareResponse = await middleware(controller, req, res);

			if (middlewareResponse != null) {
				return apiErrorResponse(req, res, middlewareResponse);
			}
		}

		const body = method == 'GET' ? query : req.body;
		const result = await handler({ ...body, id: nextcontroller.at(1) });

		res.status(200).json(result);
	};
};

const apiErrorResponse = (req: NextApiRequest, res: NextApiResponse<APIErrorResponse>, msg: APIFullErrorResponse) => {
	res.status(msg.status).json({ error: msg.error });
};
