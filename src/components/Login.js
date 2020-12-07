import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/reducers/usersReducer';
import { useForm } from 'react-hook-form';

import { Form, Button, Message } from 'semantic-ui-react';
import { Div } from './common/StyledElements';

import { makeStyles } from '@material-ui/core/styles';
import translate from '../i18n/translate';

const useStyles = makeStyles(theme => ({
  form: {
    width: '20vw',
    margin: 'auto',
    marginTop: '15vh',
  },
  submit: {
    width: '100%',
    marginTop: '2vh !important',
    textAlign: 'center !important',
  },
  msgHeader: {
    marginBottom: '0.75em !important',
  },
}));

export default function Login() {
  const loggedIn = useSelector(store => !!store.users.loggedIn.username);
  const logginError = useSelector(store => store.users.error);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const formHasErrors = !!Object.keys(errors).length;
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
        {translate('Sign in', true)}
      </Div>
      <Form.Input
        name="user_name"
        label={translate('User name', true)}
        error={
          errors.user_name
            ? {
                content: errors.user_name.message,
              }
            : false
        }
      >
        <input
          ref={register({ required: translate('User name is required', true) })}
          style={{ direction: 'ltr' }}
        />
      </Form.Input>
      <Form.Input
        name="password"
        label={translate('Password', true)}
        error={
          errors.password
            ? {
                content: errors.password.message,
              }
            : false
        }
      >
        <input
          ref={register({ required: translate('Password is required', true) })}
          style={{ direction: 'ltr' }}
        />
      </Form.Input>

      <Button
        type="submit"
        className={classes.submit}
        active={!formHasErrors}
        disable={String(formHasErrors)}
      >
        {translate('Sign in', true)}
      </Button>

      <Message error style={{ display: logginError ? 'block' : 'none' }}>
        <Message.Header className={classes.msgHeader}>
          {translate('Login error', true)}
        </Message.Header>
        <Message.Content>
          {translate('Wrong user or password. Please try again', true)}
        </Message.Content>
      </Message>
    </Form>
  );
}
