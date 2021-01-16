import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'antd/dist/antd.css';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { LogoutOutlined } from "@ant-design/icons";
import SubscriptionSucess from "./components/SubscriptionSucess";
import SubscriptionCancel from "./components/SubscriptionCancel";

function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="App">
       <ToastContainer />
      <Router>
      {isAuthenticated && <Navbar links={[<Link to="/">Home</Link>,<Link to="/profile">Profile</Link>, <Link to="/logout"><LogoutOutlined />Logout</Link>]} />}
        <Switch>
          <Route exact path="/">
            {!isAuthenticated ? <div className="login-page">
              <LoginButton />
            </div>:
            <Home />}
          </Route>

          <Route exact path="/profile">
            <div className="profile-page">
              <Profile />
            </div>
          </Route>
          <Route exact path="/subscribtion/success">
            <div className="subscription-success-page">
              <SubscriptionSucess />
            </div>
          </Route>
          <Route exact path="/subscribtion/cancel">
            <div className="subscription-cancel-page">
              <SubscriptionCancel />
            </div>
          </Route>
          <Route exact path="/logout">
            <LogoutButton />
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
