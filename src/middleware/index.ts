import { APIFullErrorResponse } from '../apiRoutes/response';
import { Controller, CRUDBase } from '../';
import { NextApiRequest, NextApiResponse } from 'next';

export type ControllerMiddleware = (
	c: Controller<unknown, unknown, CRUDBase>,
	req?: NextApiRequest,
	res?: NextApiResponse
) => APIFullErrorResponse | undefined | Promise<APIFullErrorResponse | undefined>;

export * from './debugMiddleware';
