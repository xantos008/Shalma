import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Container, Row, Card } from "react-bootstrap";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
         <>
               <div className="p-4">
                    <Container className="container_profile">
                         <Row>
                              <Card className="col-md-4 border-0">
                                <Card.Body>
                                   <div className="d-flex flex-column align-items-center text-center">
                                       <img src={user.picture} alt={user.name}  className="rounded-circle" width="100"/>
                                       <div className="mt-3">
                                            <h4>{user.name}</h4>
                                            <p className="text-secondary mb-1">{user.email}</p>
                                        </div>
                                   </div>
                                </Card.Body>
                              </Card>
                         </Row>
                    </Container>
               </div>
      </>
    )
  );
};

export default Profile;