import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {
  const newPasswordRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  
  const submitHandler = (event) => {
    event.preventDefault();

    const changedPassword = newPasswordRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD1s7srmeAr57Qb-XxhuAtKeRhQo3psSEI', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: changedPassword,
        returnSecureToken: false
    }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      history.replace('/');
    });
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='6' ref={newPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
