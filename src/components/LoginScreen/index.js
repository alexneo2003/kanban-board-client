import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { SIGNUP_MUTATION, LOGIN_MUTATION } from "../../helpers/mutations";
import { ME_QUERY } from "../../helpers/queries";
import MiniLoader from "../Loader/MiniLoader";

import "./login-screen.scss";

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginFormShow, setLoginFormShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const onSwitchForm = () => {
    setLoginFormShow(!isLoginFormShow);
    setErrorMessage("");
  };

  const onSubmitForm = (e, signup) => {
    e.preventDefault();
    signup({ variables: { name, email, password } });
  };

  const onErrorHandling = err => {
    setErrorMessage(JSON.stringify(err.graphQLErrors[0].message));
  };

  return (
    <Mutation
      mutation={isLoginFormShow ? LOGIN_MUTATION : SIGNUP_MUTATION}
      refetchQueries={[{ query: ME_QUERY }]}
      onError={error => onErrorHandling(error)}
    >
      {(signup, { loading, error, networkStatus }) => {
        if (networkStatus === 1) return <p>Network error</p>;
        return (
          <div className="login-screen">
            <div className="login-form__container">
              <form
                className="login-form"
                onSubmit={e => onSubmitForm(e, signup)}
              >
                {!isLoginFormShow && (
                  <input
                    className="login-form__input"
                    type="text"
                    placeholder="Enter Username"
                    name="name"
                    required
                    onChange={e => setName(e.target.value)}
                    value={name}
                  />
                )}
                <input
                  className="login-form__input"
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  required
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  className="login-form__input"
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  required
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />

                <button className="login-form__button-submit" type="submit">
                  {loading ? (
                    <MiniLoader />
                  ) : isLoginFormShow ? (
                    "Login"
                  ) : (
                    "Signup"
                  )}
                </button>
              </form>
              {errorMessage && (
                <span className="login-form__error">{errorMessage}</span>
              )}
              <button className="login-form__switch" onClick={onSwitchForm}>
                {isLoginFormShow ? "or Signup" : "or Login"}
              </button>
            </div>
          </div>
        );
      }}
    </Mutation>
  );
};

export default LoginScreen;
