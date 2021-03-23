import React from 'react';

import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faQuestionCircle, faChartPie, faCog, faSignOutAlt, faFileAlt} from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {

     return (
          <>
          <div className="avalanche-dashboard__sidebar col-md-2">
               <div className="sidebar__inner">

                    <div className="sidebar__logo">
                         <img alt="Avalanche" src="logo.svg" />
                    </div>

                    <div className="sidebar__menu">
                         <Nav variant="pills" className="d-flex flex-column">
                              <Nav.Item><NavLink className="nav-link" exact activeClassName="active" to="/"><FontAwesomeIcon icon={faHome}/> Home</NavLink></Nav.Item>
                              <Nav.Item><NavLink className="nav-link" activeClassName="active" to="/profile"><FontAwesomeIcon icon={faUser}/> Profile</NavLink></Nav.Item>
                              <Nav.Item><NavLink className="nav-link" activeClassName="active" to="/statistics"><FontAwesomeIcon icon={faChartPie}/> Statistics</NavLink></Nav.Item>
                              <Nav.Item><NavLink className="nav-link" activeClassName="active" to="/custom-settings"><FontAwesomeIcon icon={faCog}/> Settings</NavLink></Nav.Item> 
                         </Nav>
                    </div>

                    <hr/> 

                    <div className="sidebar__menu">
                         <Nav variant="pills" className="d-flex flex-column">
                              <Nav.Item><Nav.Link className="tutorials" href="https://mohit21gojs.github.io/avalanche.github.io/" target="_blank"><FontAwesomeIcon icon={faFileAlt}/>Tutorials</Nav.Link></Nav.Item>
                              <Nav.Item><NavLink className="nav-link" activeClassName="active" to="/help"><FontAwesomeIcon icon={faQuestionCircle}/> Talk To Us</NavLink></Nav.Item>     
                         </Nav>
                    </div>

                    <div className="sidebar__bottom-menu">
                         <Nav variant="pills" className="d-flex flex-column">
                              <Nav.Item><NavLink className="nav-link" activeClassName="active" to="/logout"><FontAwesomeIcon icon={faSignOutAlt}/> Logout</NavLink></Nav.Item>
                         </Nav>
                    </div>
               </div>
          </div>
          </>
     );

}

export default Navigation;
