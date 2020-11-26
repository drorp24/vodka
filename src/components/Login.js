import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/reducers/usersReducer';
import { useForm } from 'react-hook-form';

import { Form, Button } from 'semantic-ui-react';
import { Div } from './common/StyledElements';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  form: {
    width: '20vw',
    margin: 'auto',
    marginTop: '15vh',
  },
  submit: {
    width: '100%',
    marginTop: '2vh !important',
  },
}));

export default function Login() {
  const loggedIn = useSelector(store => !!store.users.loggedIn.username);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { state } = useLocation();

  const onSubmit = ({ user_name, password }) => {
    dispatch(fetchUser({ user_name, password }));
  };

  if (loggedIn) {
    return <Redirect to={state?.from || '/'} />;
  }

  return (
    <Form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Div
        styleType="label1"
        marginBottom="5vh"
        display="flex"
        justifyContent="center"
      >
        Sign in
      </Div>
      <Form.Input
        name="user_name"
        label="User name"
        placeholder="User Name"
        error={
          errors.user_name
            ? {
                content: errors.user_name.message,
                pointing: 'below',
              }
            : false
        }
      >
        <input ref={register({ required: 'User name is required' })} />
      </Form.Input>
      <Form.Input
        name="password"
        label="Password"
        placeholder="Password"
        error={
          errors.password
            ? {
                content: errors.password.message,
              }
            : false
        }
      >
        <input ref={register({ required: 'Password is required' })} />
      </Form.Input>

      <Button type="submit" className={classes.submit}>
        Sign in
      </Button>
    </Form>
  );
}
