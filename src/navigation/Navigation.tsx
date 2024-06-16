import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InterventionScreen from '../screen/InterventionScreen';
import MainScreen from '../screen/MainScreen';
import DetailsComponent from '../component/DetailsComponent';
import ProfileScreen from '../screen/ProfileScreen';
import LoginScreen from '../screen/LoginScreen';
import BoardingScreen from '../screen/BoardingScreen';
import ReparationScreen from '../screen/ReparationScreen';
import MapsScreen from '../screen/MapsScreen';
import MaterialScreen from '../screen/MaterialScreen';
import AddReparationScreen from '../screen/AddReparationScreen';
const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationEnabled: true,
          animationTypeForReplace: 'push',
          gestureEnabled: true,
          headerShown: false,
          headerStatusBarHeight: StatusBar.currentHeight,
        }}>
        <Stack.Screen
          name="BoardingScreen"
          component={BoardingScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InterventionScreen"
          component={InterventionScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Stack.Screen
          name="DetailsScreen"
          component={DetailsComponent}
          options={{headerShown: false}}
          initialParams={{item: null}} // Assuming 'item' is an optional parameter
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Stack.Screen
          name="ReparationScreen"
          component={ReparationScreen}
          options={{headerShown: false}}
          initialParams={{id: null, idClient: null, idItervention: null}} // Assuming 'item' is an optional parameter
        />
        <Stack.Screen
          name="MapsScreen"
          component={MapsScreen}
          options={{headerShown: false}}
          //   initialParams={{id: null}} Assuming 'item' is an optional parameter
        />
        <Stack.Screen
          name="MaterialScreen"
          component={MaterialScreen}
          options={{headerShown: false}}
          initialParams={{id: null}}
        />
        <Stack.Screen
          name="AddReparationScreen"
          component={AddReparationScreen}
          options={{headerShown: false}}
          initialParams={{idClient: null, idItervention: null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
