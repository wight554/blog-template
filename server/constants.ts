export const AUTH_CONTROLLER_ROUTE = '/api/v1/auth';
export const AUTH_LOGIN_ENDPOINT = '/login';
export const AUTH_SIGNUP_ENDPOINT = '/signup';
export const AUTH_PUT_USER_ENDPOINT = '/user/:id';

export const POST_CONTROLLER_ROUTE = '/api/v1/posts';
export const POST_GET_ALL_ENDPOINT = '/';
export const POST_GET_ENDPOINT = '/:id';
export const POST_POST_ENDPOINT = POST_GET_ALL_ENDPOINT;
export const POST_PUT_ENDPOINT = POST_GET_ENDPOINT;
export const POST_DELETE_ENDPOINT = POST_GET_ENDPOINT;
export const POST_POST_COMMENT_ENDPOINT = `${POST_GET_ENDPOINT}/comments`;

export const COMMENT_CONTROLLER_ROUTE = '/api/v1/comments';
export const COMMENT_POST_ENDPOINT = '/:postId';
export const COMMENT_PUT_ENDPOINT = '/:id';
export const COMMENT_DELETE_ENDPOINT = COMMENT_PUT_ENDPOINT;
