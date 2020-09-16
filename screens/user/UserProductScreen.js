import React, { useState, useEffect } from 'react';
import { FlatList, Button, Platform, Alert, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButtons';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();
    const userProducts = useSelector(state => state.products.userProducts);

    useEffect(()=>{
        if(error){
            Alert.alert('An error occurred!', error, [{text: 'Okay' }]);
        }
    }, [error]);

    const editProductHandler = (id) => {
        props.navigation.navigate("EditProduct", {
            productId: id
        })
    };

    const deleteProduct = async (productId) => {
        setError(null);
        setIsLoading(true);

        try {
            await dispatch(productsActions.deleteProduct(productId));
        } catch(err) {
            setError(err.message);
        }

        setIsLoading(false);
    } 
    
    const deleteProductHandler = (productId) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: deleteProduct.bind(this, productId)}
        ]) 
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary} />
            </View>
        )
    }

    return <FlatList
        data={userProducts}
        keyExtractor={item => item.id}
        renderItem={itemData => (
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={()=>{
                    editProductHandler(itemData.item.id);
                }}>
                <Button
                    color={Colors.primary}
                    title="Edit"
                    onPress={() => {
                        editProductHandler(itemData.item.id);
                    }} />
                <Button
                    color={Colors.primary}
                    title="Delete"
                    onPress={() => {
                        deleteProductHandler(itemData.item.id);
                    }} />
            </ProductItem>
        )} />
};

UserProductScreen.navigationOptions = navdata => {
    return {
        headerTitle: 'Your Products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navdata.navigation.toggleDrawer();
                    }} />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navdata.navigation.navigate("EditProduct");
                    }} />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default UserProductScreen;