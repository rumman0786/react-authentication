import { useRef, useState } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const emailInput = emailInputRef.current.value;
    const passwordInput = passwordInputRef.current.value;

    if(isLogin) {

    } else {
      const authData = {
        email: emailInput,
        password: passwordInput,
        returnSecureToken: true
      };

      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD1s7srmeAr57Qb-XxhuAtKeRhQo3psSEI',
      {
        method: 'POST',
        body: JSON.stringify(authData),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => {
        if(res.ok) {
          // ...
        } else {
          return res.json().then(data => {
            console.log(data);
          }) 
        }
      }) 
    }
  }

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
