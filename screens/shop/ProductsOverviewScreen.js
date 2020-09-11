import React from 'react';
import { FlatList, Text, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButtons';

const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    return (
        <FlatList
            keyExtractor={(item, index) => item.id}
            data={products}
            renderItem={
                (itemData) => {
                    return <ProductItem title={itemData.item.title}
                        image={itemData.item.imageUrl}
                        price={itemData.item.price}
                        onViewDetail={() => {
                            props.navigation.navigate('ProductDetail', {
                                productId: itemData.item.id,
                                productTitle: itemData.item.title
                            })
                        }}
                        onAddToCart={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }} />
                }
            }
        />
    )
}

ProductOverviewScreen.navigationOptions = navdata => {
    return {
        headerTitle: 'All Products',
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
        headerRight: () => (<HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item
                title='Cart'
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                    navdata.navigation.navigate('Cart');
                }} />
        </HeaderButtons>)
    }
}

export default ProductOverviewScreen;