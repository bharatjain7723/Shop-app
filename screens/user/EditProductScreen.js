import React, { useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButtons';
import * as productActions from '../../store/actions/products';
import Input from '../../components/UI/Input';

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

const EditProductScreen = props => {
    const dispatch = useDispatch();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: false
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ])
            return;
        }
        if (editedProduct) {
            dispatch(productActions.updateProduct(prodId,
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl));
        } else {
            dispatch(productActions.createProduct(formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
                +formState.inputValues.price));
        }
        props.navigation.goBack();
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler])

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
            // behavior='padding'
            // keyboardVerticalOffset={100}
            style={{flex: 1}}
        >
            <ScrollView style={styles.form}>
                <Input
                    id='title'
                    label='Title'
                    errorText='Please enter the title!'
                    keyboardType="default"
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initiallyValid={!!editedProduct}
                    required
                />

                <Input
                    id='imageUrl'
                    label='Image URL'
                    errorText='Please enter the image URL!'
                    keyboardType="default"
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.imageUrl : ''}
                    initiallyValid={!!editedProduct}
                    required
                />

                {editedProduct ? null : (
                    <Input
                        id='price'
                        label='Price'
                        errorText='Please enter the price!'
                        keyboardType="decimal-pad"
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.price : ''}
                        initiallyValid={!!editedProduct}
                        required
                        min={0}
                    />
                )}

                <Input
                    id='description'
                    label='Description'
                    errorText='Please enter the description!'
                    keyboardType="default"
                    autoCapitalize='sentences'
                    autoCorrect
                    multiline
                    numberOfLines={3}
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.description : ''}
                    initiallyValid={!!editedProduct}
                    required
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

EditProductScreen.navigationOptions = navdata => {
    const submitFn = navdata.navigation.getParam('submit');
    return {
        headerTitle: navdata.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn} />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    }
});

export default EditProductScreen;