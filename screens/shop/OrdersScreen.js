import React, { useState, useEffect } from 'react';
import { FlatList, Platform, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButtons';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(()=>{
        setIsLoading(true);
        dispatch(orderActions.fetchOrders()).then(()=>{
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
        })
    }, [dispatch]);

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary} />
            </View>
        )
    }

    if(orders.length === 0){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14}} >No orders found!</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <OrderItem
                    items={itemData.item.items}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate} />
            )
            }
        />
    )
}

OrdersScreen.navigationOptions = navdata => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navdata.navigation.toggleDrawer();
                    }} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;