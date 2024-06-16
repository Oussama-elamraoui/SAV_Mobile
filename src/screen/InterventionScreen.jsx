import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RendredItem from '../component/RendredItem';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
function InterventionScreen({navigation}) {
  const [loader, setLoader] = useState(false);
  const [updateTime, setUpdateTime] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      const now = new Date();
      try {
        setLoader(true);
        // Retrieve user info from storage
        const userInfo = await AsyncStorage.getItem('userInfo');
        const {uid, ocn_token_key} = JSON.parse(userInfo);

        // Construct request payload
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'project.task',
            method: 'web_search_read',
            args: [],
            kwargs: {
              limit: 80,
              offset: 0,
              order: 'planned_date_begin ASC',
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
                bin_size: true,
              },
              count_limit: 10001,
              domain: [
                '&',
                ['id', 'in', [609, 606, 198, 939, 894, 375]],
                ['type_interv', '=', 'c'],
              ],
              fields: [],
            },
          },
        };

        // Send request to API using Axios
        const response = await axios.post(
          'http://51.178.136.6:16003/web/dataset/call_kw/project.task/web_search_read',
          payload,
          {
            headers: {
              Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
              'Content-Type': 'application/json',
            },
          },
        );

        // Set tasks state with the received data
        // console.log(response.data.result);
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();

        // Formatting time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const dateUpdateData = `${day}/${month}/${year}`;
        const timeUpdateData = `${hours}:${minutes}`;
        setInterventions(response.data.result.records);
        setUpdateTime(timeUpdateData);
        setUpdateDate('Today');
        const InterventionData = {
          Interventions: response.data.result.records,
          date: now,
        };
        await AsyncStorage.setItem(
          'InterventionData',
          JSON.stringify(InterventionData),
        );
      } catch (error) {
        const InterventionData = await AsyncStorage.getItem('InterventionData');
        const {Interventions, date} = JSON.parse(InterventionData);
        setInterventions(Interventions);
        const dateToUpdate = new Date(date);
        now.setHours(0, 0, 0, 0);
        dateToUpdate.setHours(0, 0, 0, 0);

        // Calculate the difference in days
        const difference = (now - dateToUpdate) / (1000 * 3600 * 24);
        if (difference === 0) {
          setUpdateDate('Today');
        } else if (difference === 1) {
          setUpdateDate('Yesterday');
        } else {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const year = now.getFullYear();
          const dateUpdateData = `${day}/${month}/${year}`;
          // Format the date as you desire
          setUpdateDate(dateUpdateData);
        }

        // Formatting time
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const timeUpdateData = `${hours}:${minutes}`;
        setUpdateTime(timeUpdateData);
        console.error('Error fetching data:', error);
      }
      setLoader(false);
    };

    // Call the fetchData function when component mounts
    fetchData();
  }, []);

  const [interventions, setInterventions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    // Filter data based on search query
    const filtered = interventions.filter(intervention => {
      const {name, societe_mere, partner_id} = intervention;
      const societeMereName = societe_mere ? societe_mere[1] : '';
      const partnerName = partner_id ? partner_id[1] : '';
      return (
        name.includes(searchQuery) ||
        societeMereName.includes(searchQuery) ||
        partnerName.includes(searchQuery)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, interventions]);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Interventions</Text>
        <View style={styles.line} />
        <View style={styles.DateOfUpdate}>
          <Text>{updateDate}</Text>
          <Text style={{marginLeft: 6}}>{updateTime}</Text>
        </View>
      </View>

      {loader ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <View style={{backgroundColor: 'white', paddingTop: 10, marginTop: 6}}>
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <RendredItem item={item} navigation={navigation} />
            )}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 6,
    marginLeft: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginHorizontal: 6,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#777',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  DateOfUpdate: {
    marginBottom: 0,
    marginTop: 6,
    marginRight: 6,
    flexDirection: 'row',
  },
});
export default InterventionScreen;
