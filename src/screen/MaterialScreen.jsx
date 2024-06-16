import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import MaterialComponent from '../component/material/MaterialComponent';
import Header from '../component/ArrowBack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const MaterialScreen = ({route, navigation}) => {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const id = route.params?.id;
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const {uid, ocn_token_key} = JSON.parse(userInfo);

        const payload = {
          id: 5,
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'product.product',
            method: 'web_search_read',
            args: [],
            kwargs: {
              limit: 40,
              offset: 0,
              order: '',
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
                bin_size: true,
                active_model: 'project.task',
                active_id: id,
                active_ids: [id],
                fsm_mode: true,
                create: true,
                fsm_task_id: id,
                pricelist: 1,
                hide_qty_buttons: false,
                default_invoice_policy: 'delivery',
              },
              count_limit: 10001,
              domain: [
                '&',
                '&',
                '&',
                ['sale_ok', '=', true],
                '|',
                ['detailed_type', 'in', ['consu', 'product']],
                '&',
                '&',
                ['detailed_type', '=', 'service'],
                ['invoice_policy', '=', 'delivery'],
                ['service_type', '=', 'manual'],
                '|',
                ['company_id', '=', 1],
                ['company_id', '=', false],
                ['id', '!=', 1],
              ],
              fields: [
                'id',
                'name',
                'tracking',
                'serial_missing',
                'quantity_decreasable',
                'product_template_attribute_value_ids',
                'fsm_partner_price',
                'fsm_partner_price_currency_id',
                '__last_update',
                'priority',
                'default_code',
                'currency_id',
                'qty_available',
                'uom_id',
                'fsm_quantity',
              ],
            },
          },
        };

        const response = await axios.post(
          'http://51.178.136.6:16003/web/dataset/call_kw/product.product/web_search_read',
          payload,
          {
            headers: {
              Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
              'Content-Type': 'application/json',
            },
          },
        );

        // console.log(response.data.result);
        if (response.data.result) {
          setData(response.data.result.records);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoader(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <Header title={'Choisir des produits'} navigation={navigation} />
      {loader ? (
        <View style={{alignContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        </View>
      ) : data ? (
        data.length ? (
          <MaterialComponent
            data={data}
            navigation={navigation}
            idIntervention={id}
          />
        ) : (
          <View style={styles.containerNoItem}>
            <LottieView
              source={require('../assets/noItem.json')}
              loop={false}
              autoPlay
              style={styles.lottie}
            />
            <Text>no item</Text>
          </View>
        )
      ) : (
        <Text>Loading failed</Text>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 24,
  },
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
export default MaterialScreen;
