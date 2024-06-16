import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker} from 'react-native-maps';
import Header from '../component/ArrowBack';
import Geolocation from '@react-native-community/geolocation';
const MapsScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = [];
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Permission',
            message: 'We would like to use your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        info => setLocation([info.coords.latitude, info.coords.longitude]),
        error => console.warn(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={'la localisation du client'} />
      <TouchableOpacity
        style={{
          borderWidth: 1,
          paddingHorizontal: 10,
          borderColor: 'white',
          marginTop: 10,
          paddingVertical: 10,
          position: 'absolute',
          top: 61,
          left: 10,
          borderRaduis: 30,
          zIndex: 5,
          flexDirection: 'row',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        }}>
        <Icon
          name="map-marker-plus-outline"
          size={20}
          color="white"
          style={{marginRight: 5}}
        />
        <Text
          style={{
            color: 'rgba(128, 128, 128, 0.7)',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Mis a jour localisation
        </Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}>
        {location && <Marker coordinate={location} title="You are here" />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapsScreen;
