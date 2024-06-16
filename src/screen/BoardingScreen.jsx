import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoardingScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const {ocn_token_key} = JSON.parse(userInfo);

      // Construct request payload
      const payload = {
        id: 117,
        jsonrpc: '2.0',
        method: 'call',
        params: {
          thread_id: 198,
          thread_model: 'project.task',
          limit: 30,
          min_id: 6568,
        },
      };

      // Send request to API using Axios
      const response = await axios.post(
        'http://51.178.136.6:16003/web/session/get_session_info',
        payload,
        {
          headers: {
            Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.result) {
        navigation.navigate('MainScreen');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          }),
        );
      }
    };

    // const timeout = setTimeout(() => {
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{name: 'LoginScreen'}],
    //     }),
    //   );
    // }, 4000); // Timeout set for 4000 milliseconds (4 seconds)
    getUserInfo()
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/New (2).json')} // Path to your Lottie file
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.footerText}>from doosys</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  animation: {
    height: 200,
    width: 200,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});

export default BoardingScreen;
