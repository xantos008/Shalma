import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    localStorage.removeItem("access_token");
    logout({ returnTo: window.location.origin })
  }, [logout])

  return null;
};

export default LogoutButton;