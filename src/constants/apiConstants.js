export const API_BASE_URL = "http://localhost:3100";
export const ACCESS_TOKEN_NAME = "access_token";
export const AUTHORIZATION = `Bearer ${localStorage.getItem(
  ACCESS_TOKEN_NAME
)}`;

export const API_LOGIN = API_BASE_URL + "/api/auth/login";
export const API_REGISTER = API_BASE_URL + "/api/auth/register";
export const API_CHECK_AUTH = API_BASE_URL + "/api/auth/check-auth";

export const API_USERS = API_BASE_URL + "/api/users";
