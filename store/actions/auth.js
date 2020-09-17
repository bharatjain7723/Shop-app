import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token
        })
    }

}

export const signup = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAgS1ePrDwYu7CD9cQ6T0v4PfS7ItHtYaA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                const errorId = errorResponseData.error.message;
                let message = 'Something went wrong!';

                if (errorId === 'EMAIL_EXISTS') {
                    message = 'This email already exists.'
                }

                throw new Error(message);
            }

            const resData = await response.json();

            // console.log(resData);


            dispatch(
                authenticate(
                    resData.localId,
                    resData.idToken,
                    parseInt(resData.expiresIn) * 1000
                )
            );

            const expirationDate = new Date(new Date().getTime + (parseInt(resData.expiresIn) * 1000));
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);

        } catch (err) {
            throw err;
        }
    }
};

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAgS1ePrDwYu7CD9cQ6T0v4PfS7ItHtYaA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                const errorId = errorResponseData.error.message;
                let message = 'Something went wrong!';

                console.log(errorResponseData)


                if (errorId === 'EMAIL_NOT_FOUND') {
                    message = 'Email could not be found.'
                } else if (errorId === 'INVALID_PASSWORD') {
                    message = 'This password is invalid.'
                } else if (errorId === 'USER_DISABLED') {
                    message = 'The user account has been disabled.'
                }

                throw new Error(message);
            }

            const resData = await response.json();

            // console.log(resData);


            // dispatch({
            //     type: LOGIN,
            //     token: resData.idToken,
            //     userId: resData.localId
            // });
            dispatch(
                authenticate(
                    resData.localId,
                    resData.idToken,
                    parseInt(resData.expiresIn) * 1000
                )
            ); 

            const expirationDate = new Date(new Date().getTime() + (parseInt(resData.expiresIn) * 1000));
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);

        } catch (err) {
            // console.log(err);

            throw err;
        }
    }
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    }
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = (expirationTime) => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime)
    }
}

const saveDataToStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expiryDate.toISOString()
    }))
}