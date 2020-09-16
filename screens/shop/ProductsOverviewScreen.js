import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Platform, Button, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButtons';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);
    // We can omit setIsLoading and setError because they will never be created again

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(()=>{
            setIsLoading(false);
        })
    }, [dispatch, loadProducts]);

    const onSelectHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    };

    if(error){
        return (
            <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primary} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary} />
            </View>
        )
    }

    if(!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found!!</Text>
            </View>
        )
    }

    return (
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadProducts}
            keyExtractor={(item, index) => item.id}
            data={products}
            renderItem={
                (itemData) => {
                    return <ProductItem title={itemData.item.title}
                        image={itemData.item.imageUrl}
                        price={itemData.item.price}
                        onSelect={() => {
                            onSelectHandler(itemData.item.id, itemData.item.title)
                        }}>
                        <Button
                            color={Colors.primary}
                            title="View Details"
                            onPress={() => {
                                onSelectHandler(itemData.item.id, itemData.item.title)
                            }} />
                        <Button
                            color={Colors.primary}
                            title="To Cart"
                            onPress={() => {
                                dispatch(cartActions.addToCart(itemData.item));
                            }} />
                    </ProductItem>
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

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductOverviewScreen;