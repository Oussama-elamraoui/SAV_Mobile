import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('a.karama86@gmail.com');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    const params = {
      db: 'sav',
      login: username,
      password: password,
      base_location: 'http://51.178.136.6:16003//',
    };

    try {
      const response = await axios.post(
        'http://51.178.136.6:16003//web/session/authenticate',
        {params},
      );
      setLoading(false);
      if (response.data && response.data.result) {
        // Extract the needed fields from response.data.result
        const userInfo = {
          ocn_token_key: response.data.result.ocn_token_key,
          expiration_date: response.data.result.expiration_date,
          profile_params: response.data.result.profile_params,
          uid: response.data.result.uid,
          is_system: response.data.result.is_system,
          is_admin: response.data.result.is_admin,
          name: response.data.result.name,
          username: response.data.result.username,
          partner_display_name: response.data.result.partner_display_name,
        };
        console.log(userInfo);
        // Store the userInfo in AsyncStorage
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        navigation.navigate('MainScreen');
        // Alert.alert('Login Successful', 'You have been logged in successfully');
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      // Handle error
      setLoading(false);

      console.error('Error logging in', error);
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again',
      );
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/LoginImage.png')} // Replace with your local image path
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {/* navigation.navigate('MainScreen') */}
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Please contact the administration to create an account and login.
        </Text>
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
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
  logo: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: 300,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  instructionContainer: {
    paddingHorizontal: 30,
  },
  instruction: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'gray',
  },

});

export default LoginScreen;
