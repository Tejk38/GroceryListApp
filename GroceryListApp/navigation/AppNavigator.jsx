
import React, { useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';
import ItemListScreen from '../screens/ItemListScreen';
import Mailsender from '../screens/Authentication/Mailsender';
import ScannerScreen from '../screens/ScannerScreen';
import UserScreen from '../screens/UserScreen';
import RecipeNavigator from './RecipeNavigator';
import ProductListScreen from '../screens/Product/ProductListScreen';
// import MapScreen from '../screens/MapScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {user ? (
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: false }}/>
                    <Stack.Screen name="Mailsender" component={Mailsender} options={{ headerShown: false }}/>
                </>
            )}
            {/* <Stack.Screen name="MapScreen" component={MapScreen} /> */}
        </Stack.Navigator>
    );
};

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                    case 'ProductList':
                        iconName = focused ? 'home' : 'home-outline';
                        break;
                    case 'Add':
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                        break;
                    case 'Scanner':
                        iconName = focused ? 'qr-code' : 'qr-code-outline';
                        break;
                    case 'Recipes':
                        iconName = focused ? 'fast-food' : 'fast-food-outline';
                        break;
                    case 'User':
                        iconName = focused ? 'person' : 'person-outline';
                        break;
                    default:
                        iconName = 'help-circle';
                        break;
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="ProductList" component={ProductListScreen} />
        <Tab.Screen name="Add" component={ItemListScreen}  />
        <Tab.Screen name="Scanner" component={ScannerScreen} />
        <Tab.Screen name="Recipes" component={RecipeNavigator} options={{ headerShown: false }}/>
        <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
);

export default AppNavigator;



