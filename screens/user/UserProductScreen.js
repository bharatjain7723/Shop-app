import React from 'react';
import { FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButtons';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductScreen = props => {
    const dispatch = useDispatch();
    const userProducts = useSelector(state => state.products.userProducts);

    const editProductHandler = (id) => {
        props.navigation.navigate("EditProduct", {
            productId: id
        })
    };
    
    const deleteProductHandler = (productId) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productsActions.deleteProduct(productId));
            }}
        ]) 
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

export default UserProductScreen;