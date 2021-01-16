import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    const { searchParams } = new URL(window.location);
    if(!searchParams.get('code')){
      loginWithRedirect();
    }
  }, []);
  return null;
};

export default LoginButton;