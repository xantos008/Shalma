import React from "react";
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();
  return <Button className="login-button" type="primary" icon={<LoginOutlined />} onClick={() => loginWithPopup()}>Log In</Button>;
};

export default LoginButton;