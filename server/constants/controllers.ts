export const AUTH_CONTROLLER_ROUTE = '/api/v1/auth';
export const AUTH_LOGIN_ENDPOINT = '/login';

export const USER_CONTROLLER_ROUTE = '/api/v1/users';
export const USER_CREATE_ENDPOINT = '/';
export const USER_UPDATE_ENDPOINT = '/:id';

export const POST_CONTROLLER_ROUTE = '/api/v1/posts';
export const POST_GET_ALL_ENDPOINT = '/';
export const POST_GET_ENDPOINT = '/:id';
export const POST_CREATE_ENDPOINT = POST_GET_ALL_ENDPOINT;
export const POST_UPDATE_ENDPOINT = POST_GET_ENDPOINT;
export const POST_DELETE_ENDPOINT = POST_GET_ENDPOINT;
export const POST_CREATE_COMMENT_ENDPOINT = `${POST_GET_ENDPOINT}/comments`;

export const COMMENT_CONTROLLER_ROUTE = '/api/v1/comments';
export const COMMENT_UPDATE_ENDPOINT = '/:id';
export const COMMENT_DELETE_ENDPOINT = COMMENT_UPDATE_ENDPOINT;
