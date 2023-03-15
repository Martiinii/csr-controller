import { IpcMain } from 'electron';
import { Controller, CRUDBase, ControllerProps, CRUDFetchMethod } from '../..';
import { ControllerMiddleware } from '../../middleware';
import { getHandler } from '../handler';
import {
	APIFullErrorResponse,
	badRequestResponse,
	controllerNotFound,
	subControllerNotFound,
	unimplementedMethodResponse,
} from '../response';

/**
 * Electron API route to use with controllers
 *
 * @param i ipcMain from electron
 * @param args Routes made with controllerRegistry
 * @param middlewares Array of middlewares to execute (in order)
 */
export const withElectronInvokations = (
	i: IpcMain,
	args: Map<string, Controller<unknown, unknown, CRUDBase>>,
	...middlewares: ControllerMiddleware[]
) => {
	i.handle(
		'csr-controller',
		async (event, c: ControllerProps, method: (typeof CRUDFetchMethod)[number], data?: object & CRUDBase) => {
			const hasSubController = c.$parentUrl != null;
			const mainUrl = hasSubController ? c.$parentUrl : c.$url;
			const id = data?.id;

			// If the route is not found in map there is no controller defined
			if (!args.has(mainUrl)) {
				return apiErrorResponse(controllerNotFound(mainUrl));
			}

			let controller = args.get(mainUrl);

			// Use sub controller?
			if (hasSubController) {
				if (!controller[c.$url]) {
					return apiErrorResponse(subControllerNotFound(c.$url));
				}

				controller = controller[c.$url];
			}

			// Get handler method from controller based on the method
			const handler = getHandler(method, id ? ['', id] : [], controller);

			// If the handler is not implemented
			if (handler == null) {
				return apiErrorResponse(unimplementedMethodResponse);
			}

			// Run every middleware in sequence. If any fails, return error response
			for (const middleware of middlewares) {
				const middlewareResponse = await middleware(controller);

				if (middlewareResponse != null) {
					return apiErrorResponse(middlewareResponse);
				}
			}

			try {
				return await handler(data);
			} catch (_) {
				return apiErrorResponse(badRequestResponse);
			}
		}
	);
};

const apiErrorResponse = (msg: APIFullErrorResponse) => {
	return {
		error: {
			msg: msg.error,
		},
	};
};
