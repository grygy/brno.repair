import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Problems from '../pages/Problems';
import Profile from '../pages/Profile';
import UploadNewProblem from '../pages/UploadNewProblem';

const Routes = () => (
	<Switch>
		<Route path="/" exact component={Home} />
		<Route path="/problems" exact component={Problems} />
		<Route path="/upload-new-problem" exact component={UploadNewProblem} />
		<Route path="/profile" exact component={Profile} />
		<Route path="/login" exact component={Login} />
		<Route component={NotFound} />
	</Switch>
);
export default Routes;
