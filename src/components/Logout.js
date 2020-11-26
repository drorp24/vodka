import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/usersReducer';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'semantic-ui-react';
import { withTheme } from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3em',
  },
  username: {
    marginRight: '1em',
    lineHeight: '2',
    fontSize: '0.8125rem',
    textTransform: 'uppercase',
  },
  button: {
    lineHeight: '2',
    fontSize: '0.8125rem',
  },
}));

const Logout = ({ theme }) => {
  const username = useSelector(store => store.users.loggedIn.username);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClick = () => {
    dispatch(logout());
  };

  if (!username) return null;

  return (
    <div className={classes.root}>
      <span className={classes.username}>{username}</span>
      <Button
        color={theme['topbarSliderButton']}
        size="small"
        circular
        icon={'shutdown'}
        onClick={handleClick}
      />
    </div>
  );
};

export default withTheme(Logout);
