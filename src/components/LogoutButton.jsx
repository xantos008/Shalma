import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("ads_method");
    logout({ returnTo: window.location.origin })
  }, [logout])

  return null;
};

export default LogoutButton;