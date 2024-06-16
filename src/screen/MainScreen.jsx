import InterventionScreen from './InterventionScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
const Tab = createBottomTabNavigator();
import TopBarHome from '../component/TobBarHome';

const MainScreen = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <TopBarHome navigation={navigation}/>
      <Tab.Navigator
        initialRouteName="InterventionScreen"
        screenOptions={{
          headerShown: false,
          showLabel: false,
          style: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            ...style.shadow,
            paddingBottom: 5,
          },
        }}>
        <Tab.Screen name="InterventionScreen" component={InterventionScreen} />
        <Tab.Screen name="settings" component={InterventionScreen} />
      </Tab.Navigator>
    </View>
  );
};
const style = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
export default MainScreen;
