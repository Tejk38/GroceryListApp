
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { GroceryProvider } from './context/GroceryContext';

const App = () => {
    return (
        <AuthProvider>
            <GroceryProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </GroceryProvider>
        </AuthProvider>
    );
};

export default App;
