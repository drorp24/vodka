import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const loggedIn = useSelector(store => !!store.users.loggedIn.username);

  return (
    <Route
      {...rest}
      render={() => (loggedIn ? children : <Redirect to="/login" />)}
    />
  );
};

export default PrivateRoute;
