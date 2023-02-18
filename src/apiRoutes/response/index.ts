export type APIErrorResponse = {
	error: string;
};

export type APIFullErrorResponse = {
	status: number;
} & APIErrorResponse;

export const unimplementedMethodResponse: APIFullErrorResponse = {
	status: 405,
	error: 'Method not allowed',
};

export const notAuthorizedResponse: APIFullErrorResponse = {
	status: 401,
	error: 'Not authorized',
};

export const noPermissionResponse: APIFullErrorResponse = {
	status: 403,
	error: 'No permission',
};

export const controllerNotFound = (path: string): APIFullErrorResponse => ({
	status: 404,
	error: `${path}Controller not found`,
});
