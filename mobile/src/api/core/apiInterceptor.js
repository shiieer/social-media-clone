// api/core/apiInterceptor.js
// Global interceptor untuk handle unauthorized errors (401/403)

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
	unauthorizedHandler = handler;
};

export const getUnauthorizedHandler = () => {
	return unauthorizedHandler;
};

export const handleUnauthorized = (status) => {
	if (unauthorizedHandler) {
		unauthorizedHandler(status);
	}
};

