import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../../helpers/mutations';
import { BOARDS_QUERY, ME_QUERY } from '../../helpers/queries';
import MiniLoader from '../Loader/MiniLoader';

import './login-screen.scss';

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginFormShow, setLoginFormShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const onErrorHandling = (err) => {
    setErrorMessage(JSON.stringify(err.graphQLErrors[0].message));
  };

  const [login, { loading: loadingLogin }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => onErrorHandling(error),
  });
  const [signup, { loading: loadingSignup }] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => onErrorHandling(error),
  });

  const onSwitchForm = () => {
    setLoginFormShow(!isLoginFormShow);
    setErrorMessage('');
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-expressions
    isLoginFormShow
      ? login({
          variables: { email, password },
          refetchQueries: [{ query: ME_QUERY }, { query: BOARDS_QUERY }],
        })
      : signup({
          variables: { name, email, password },
          refetchQueries: [{ query: ME_QUERY }, { query: BOARDS_QUERY }],
        });
  };

  return (
    <div className="login-screen">
      <div className="login-form__container">
        <form className="login-form" onSubmit={(e) => onSubmitForm(e)}>
          {!isLoginFormShow && (
            <input
              className="login-form__input"
              type="text"
              placeholder="Enter Username"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          )}
          <input
            className="login-form__input"
            type="email"
            placeholder="Enter Email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            className="login-form__input"
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button className="login-form__button-submit" type="submit">
            {loadingLogin || loadingSignup ? (
              <MiniLoader />
            ) : isLoginFormShow ? (
              'Login'
            ) : (
              'Signup'
            )}
          </button>
        </form>
        {errorMessage && (
          <span className="login-form__error">{errorMessage}</span>
        )}
        <button
          className="login-form__switch"
          onClick={onSwitchForm}
          type="button">
          {isLoginFormShow ? 'or Signup' : 'or Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
