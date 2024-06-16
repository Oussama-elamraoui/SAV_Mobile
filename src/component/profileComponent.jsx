import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const UserProfile = ({userInfo}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/userIcon.png')} // Replace with actual path to user icon
        style={styles.image}
      />
      <View style={{flex: 1, alignItems: 'flex-start',width:'100%', marginTop:50}}>
        <Text style={styles.text}>Name: {userInfo.name}fffffffffff</Text>
        <Text style={styles.text}>Username: {userInfo.username}</Text>
        {/* <Text style={styles.text}>Language: {userInfo.user_context.lang}</Text> */}
        {/* <Text style={styles.text}>Timezone: {userInfo.user_context.tz}</Text> */}
        {/* <Text style={styles.text}>
        Company: {userInfo.user_companies.allowed_companies[1].name}
      </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignContent:'center',
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: 'auto',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default UserProfile;
