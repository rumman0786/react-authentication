import  React, {useCallback, useEffect, useState} from 'react';

let logoutTimer = null;
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

const calculateRemainingDuration = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    return adjExpirationTime - currentTime;
}

const retrieveStoredData = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingDuration(storedExpirationTime);

    if(remainingTime < 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    };
}

export const AuthContextProvider = (props) => {
    const storedData = retrieveStoredData();
    const initialToken = storedData !== null ? storedData.token : null;
    const [token, setToken] = useState(initialToken);

    const userLoggedIn = !!token;

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        logoutTimer = setTimeout(logoutHandler, calculateRemainingDuration(expirationTime));
    }

    const logoutHandler = useCallback(() => {
        setToken(null);
        clearTimeout(logoutTimer);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
    }, [])

    useEffect(() => {
        if(storedData) {
            logoutTimer = setTimeout(logoutHandler, storedData.duration);
        }
    }, [storedData, logoutHandler])

    const contextValue = {
        token: token,
        isLoggedIn: userLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    } 

    return <AuthContext.Provider value={contextValue}>
                {props.children}
            </AuthContext.Provider>;
}

export default AuthContext;