import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButtons';
import * as productActions from '../../store/actions/products';

const EditProductScreen = props => {
    const dispatch = useDispatch();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

    const submitHandler = useCallback(() => {
        // console.log('submitting');
        if(editedProduct){
            dispatch(productActions.updateProduct(prodId, title, description, imageUrl));
        } else {
            dispatch(productActions.createProduct(title, description, imageUrl, +price));
        }
        props.navigation.goBack();
    }, [dispatch, prodId, title, description, imageUrl, price]);

    useEffect(()=>{
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler])

    return (
        <ScrollView style={styles.form}>
            <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={text => setTitle(text)} />
            </View>

            <View style={styles.formControl}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput
                    style={styles.input}
                    value={imageUrl}
                    onChangeText={text => setImageUrl(text)} />
            </View>

            {editedProduct ? null : <View style={styles.formControl}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={text => setPrice(text)} />
            </View>}

            <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={text => setDescription(text)} />
            </View>
        </ScrollView>
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
    },
    formControl: {
        width: '100%'
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    }
});

export default EditProductScreen;