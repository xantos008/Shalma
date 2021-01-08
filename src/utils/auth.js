
export const checkIsAuthenticated = () => {
    return localStorage.getItem("access_token");
}