import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReparationList from '../component/reparation/ReparationList';
import Header from '../component/ArrowBack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
const ReparationScreen = ({navigation, route}) => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const id = route.params?.id;
  const idClient = route.params?.idClient;
  const idItervention = route.params?.idItervention;
  const animation = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const {uid, ocn_token_key} = JSON.parse(userInfo);
        const payload = {
          id: 40,
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'repair.order',
            method: 'web_search_read',
            args: [],
            kwargs: {
              limit: 80,
              offset: 0,
              order: '',
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
                bin_size: true,
                params: {
                  id: id,
                  cids: 1,
                  menu_id: 417,
                  action: 303,
                  model: 'project.task',
                  view_type: 'form',
                },
                fsm_mode: true,
                graph_measure: '__count__',
                graph_groupbys: ['project_id'],
                pivot_measures: ['__count__'],
                active_model: 'project.task',
                active_id: id,
                active_ids: [id],
              },
              count_limit: 10001,
              domain: [['ticket_id', '=', id]],
              fields: [
                'activity_exception_icon',
                'company_id',
                'priority',
                'name',
                'schedule_date',
                'description',
                'product_id',
                'product_qty',
                'product_uom',
                'user_id',
                'partner_id',
                'address_id',
                'guarantee_limit',
                'picking_id',
                'is_returned',
                'sale_order_id',
                'location_id',
                'state',
                'activity_exception_decoration',
              ],
            },
          },
        };

        const response = await axios.post(
          'http://51.178.136.6:16003/web/dataset/call_kw/repair.order/web_search_read',
          payload,
          {
            headers: {
              Authorization: `Bearer ${ocn_token_key}`, //Replace with your authorization token
              'Content-Type': 'application/json',
            },
          },
        );

        // console.log(response.data.result);
        setData(response.data.result.records);
        console.log(response.data.result.records[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoader(false);
    };

    fetchData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} title={'List des réparation'} />
      {!loader ? (
        data ? (
          data.length ? (
            <ReparationList
              data={data}
              navigation={navigation}
              idClient={idClient}
              idItervention={idItervention}
            />
          ) : (
            <View style={styles.containerNoItem}>
              <LottieView
                ref={animation}
                source={require('../assets/noItem.json')}
                loop={false}
                autoPlay
                style={styles.lottie}
              />
              <Text>no item</Text>
            </View>
          )
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Loading failed</Text>
          </View>
        )
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loader</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  containerNoItem: {
    width: 'auto',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
export default ReparationScreen;
