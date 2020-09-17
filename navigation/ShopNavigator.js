import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import ProductOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import StartupScreen from '../screens/StartupScreen';

import Colors from '../constants/Colors';
import AuthScreen from '../screens/user/AuthScreen';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS == 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS == 'android' ? 'white' : Colors.primary
};

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailsScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons 
            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            size={23}
            color={drawerConfig.tintColor} />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createStackNavigator({
    Orders: OrderScreen
}, {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons 
            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
            size={23}
            color={drawerConfig.tintColor} />
        )
    }
});

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
}, {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons 
            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            size={23}
            color={drawerConfig.tintColor} />
        )
    }
});

const shopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch(); 
        return (
            <View style={{flex: 1, paddingTop: 40}} >
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}} >
                    <DrawerItems {...props} />
                    <Button 
                    title="Logout" 
                    color={Colors.primary}
                    onPress={()=>{
                        dispatch(authActions.logout());
                        // props.navigation.navigate('Auth');
                    }} />
                </SafeAreaView>
            </View>
        )
    }
});

const authNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: authNavigator,
    Shop: shopNavigator
});

export default createAppContainer(MainNavigator);