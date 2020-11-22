import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const loggedIn = useSelector(store => !!store.loggedIn?.username);
  const [permit, setPermit] = useState(false);
  console.log('in PrivateRoute. loggedIn: ', loggedIn);

  useEffect(() => {
    setPermit(loggedIn);
  }, [loggedIn]);

  return (
    <Route
      {...rest}
      render={() => (permit ? children : <Redirect to='/login' />)}
    />
  );
};

export default PrivateRoute;
