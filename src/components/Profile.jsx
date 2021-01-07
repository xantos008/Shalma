import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MailTwoTone, UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="profile">
        <div className="profile_header">
          <img className="profile_picture" src={user.picture} alt={user.name} />
        </div>
        <div className="profile_body">
          <h2><UserOutlined />  {user.name}</h2>
          <p><MailTwoTone /> {user.email}</p>
        </div>
        
      </div>
    )
  );
};

export default Profile;