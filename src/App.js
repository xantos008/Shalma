import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import {Container, Row, Col} from "react-bootstrap";

// styles {
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css';
// }

// ui {
import Navigation from "./components/ui/Navigation";
// }

// Components {
import Dashboard from "./components/Dashboard/Dashboard";
import Help from './components/Help/Help';
// }

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile/Profile';

import Statistics from './components/Statistics';
import Customize from './components/Customize';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useAuth0 } from '@auth0/auth0-react';

import SubscriptionSucess from "./components/SubscriptionSucess";
import SubscriptionCancel from "./components/SubscriptionCancel";


function App() {
 
     const { isAuthenticated } = useAuth0();
     
     return (
          <div className="avalanche-dashboard">
               <ToastContainer />
               <Container fluid>
                    <Row>
                         <Router>
                              {isAuthenticated && <Navigation/>}

                              <Col className="avalanche-dashboard__container" xs={12} md={{ span:10, offset:2}}>
                                   <Switch>
                                        <Route exact path="/">
                                             { !isAuthenticated ? <div className="login-page"><LoginButton/></div> : <Dashboard/> }
                                        </Route>
                                        
                                        <Route exact path="/profile">
                                             <div className="profile-page"><Profile /></div>
                                        </Route>

                                        <Route path="/help">
                                             <Help/>
                                        </Route>

                                        <Route path="/custom-settings">
                                             <Customize />
                                        </Route>

                                        <Route path="/statistics">
                                             <Statistics />
                                        </Route>

                                        <Route exact path="/subscribtion/success">
                                             <div className="subscription-success-page"><SubscriptionSucess /></div>
                                        </Route>
                                        
                                        <Route exact path="subscribtion/cancel">
                                             <div className="subscription-cancel-page"><SubscriptionCancel /></div>
                                        </Route>
                                        
                                        <Route exact path="/logout">
                                             <LogoutButton />
                                        </Route>
                                   </Switch>
                              </Col>
                         </Router>
                    </Row>
               </Container>
          </div>);
}

export default App;