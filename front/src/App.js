import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import Home from './components/Home.js';
import Films from './components/Films.js'
import Actors from './components/Actors.js';
import Admin from './components/Admin.js';
import NotFound404 from './components/NotFound404.js';

import './App.css';





function App() {
    return (
        <Router>
            <div className="App">
                <div>
                    <nav>
                        <ul>
                            <li>
                                <NavLink activeClassName="selected" exact to="/">Home</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/films">Films</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="selected" to="/actors">Actors</NavLink>
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
                        <Route path="/films">
                            <Films />
                        </Route>
                        <Route path="/actors">
                            <Actors />
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