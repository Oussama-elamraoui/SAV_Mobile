import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LogoutComponent from './Logout/LogoutComponent';
const TopBarHome = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.title}>Your App Name</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={{marginRight: 14}}
          onPress={() => navigation.navigate('ProfileScreen')}>
          {/*onPress={() => navigation.navigate('Profile')} */}
          <FontAwesomeIcon name="user" size={26} color="#48a7fd" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {/* onPress={() => alert('Logged out')} */}
          <MaterialCommunityIcon name="logout" size={26} color="#48a7fd" />
        </TouchableOpacity>
      </View>
      <LogoutComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff', // Change the color to your desired header color
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Change the color to your desired border color
    marginBottom: 10,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Change the color to your desired text color
  },
  logo: {
    width: 40,
    height: 40,
  },
});

export default TopBarHome;
