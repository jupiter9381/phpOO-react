import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import Home from './components/Home.js';
import Authors from  './components/Authors.js';
import Sessions from  './components/Sessions.js';
import Schedule from  './components/Schedule.js';
import Admin from './components/Admin.js';
import NotFound404 from './components/NotFound404.js';

import './App.css';
import history from './history.js';

function App() {
    return (
        <Router history={history}>
            <div className="App">
                <div>
                    <nav>
                        <ul>
                            <li>
                                <NavLink activeClassName="selected" exact to="/">Home</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/schedule">Schedule</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/author">Authors</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/sessions">Sessions</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/admin">Admin</NavLink>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/schedule">
                            <Schedule />
                        </Route>
                        <Route path="/author">
                            <Authors />
                        </Route>
                        <Route path="/sessions">
                            <Sessions />
                        </Route>
                        <Route path="/admin">
                            <Admin />
                        </Route>
                        <Route path="*">
                            <NotFound404 />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;