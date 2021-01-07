import jwt from 'jwt-decode';

export const decodeJwt = token => jwt(token);