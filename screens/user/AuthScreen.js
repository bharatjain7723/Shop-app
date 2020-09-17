import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient'

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }

        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignUp, setIsSignUp] = useState(false); 
    const dispatch = useDispatch();

    const authHandler = async () => {
        let action;        
        if(!formState.formIsValid) {
            Alert.alert('Wrong input', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ])
            return;
        }
        if(isSignUp){
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password)
        } else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password)
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Shop')
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(()=>{
        if(error){
            Alert.alert('An error occurred', error, [
                { text: 'Okay' }
            ])  
        }
    }, [error])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            keyboardVerticalOffset={50}
            behavior="padding" >
            <LinearGradient
                colors={['#ffedff', '#ffe3ff']}
                style={styles.gradient}
            >
                <Card style={styles.authContainer} >
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />

                        <View style={styles.buttonContainer}>
                            {isLoading ?
                                <ActivityIndicator
                                    size='small'
                                    color={Colors.primary} /> :
                                <Button
                                    title={isSignUp ? "Sign Up" : "Login"}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />
                            }
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                                color={Colors.accent}
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState);
                                }}
                            />
                        </View>

                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate',

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;