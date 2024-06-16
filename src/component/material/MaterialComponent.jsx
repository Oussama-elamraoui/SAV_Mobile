import React, {useState, memo} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const updateQuantityAPI = async (id, newQuantity, idIntervention) => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const {uid, ocn_token_key} = JSON.parse(userInfo);
    console.log(ocn_token_key);
    const payloadQ = {
      id: 29,
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'product.product',
        method: 'set_fsm_quantity',
        args: [id, newQuantity],
        kwargs: {
          context: {
            lang: 'fr_FR',
            tz: 'Africa/Casablanca',
            uid: uid,
            allowed_company_ids: [1],
            active_model: 'project.task',
            active_id: idIntervention,
            active_ids: [idIntervention],
            fsm_mode: true,
            create: true,
            fsm_task_id: idIntervention,
            pricelist: 1,
            hide_qty_buttons: false,
            default_invoice_policy: 'delivery',
          },
        },
      },
    };
    console.log(payloadQ.params);
    const response = await axios.post(
      'http://51.178.136.6:16003/web/dataset/call_kw/product.product/set_fsm_quantity',
      payloadQ,
      {
        headers: {
          Authorization: `Bearer ${ocn_token_key}`, //Replace with your authorization token
          'Content-Type': 'application/json',
        },
      },
    );
    // if (!response.ok) {
    //   throw new Error('Failed to update quantity');
    // }
    console.log(response.data);
    // return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const Item = memo(
  ({
    id,
    name,
    price,
    quantity,
    onQuantityChange,
    priority,
    qty_available,
    idIntervention,
    handlePriority,
  }) => (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => handlePriority(id, priority === '1' ? '0' : '1')}>
          {priority === '1' ? (
            <Icon name={'star'} color={'#DDCC00'} size={24} />
          ) : (
            <Icon name={'staro'} color={'grey'} size={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>
          {name.length < 20 ? name : `${name.slice(0, 20)}...`}
        </Text>
      </View>
      <Text style={{fontSize: 11, color: 'grey'}}>Price: {price} MAD</Text>
      <Text style={{fontSize: 11, color: 'grey'}}>
        Quantity: {qty_available}
      </Text>
      <View
        style={{
          fontSize: 11,
          color: 'grey',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => onQuantityChange(id, quantity - 1, idIntervention)}
          style={{backgroundColor: 'rgba(213, 213, 213, 0.4)', padding: 12}}>
          <Icon name="caretleft" size={20} />
        </TouchableOpacity>
        <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text>{quantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onQuantityChange(id, quantity + 1, idIntervention)}
          style={{backgroundColor: 'rgba(213, 213, 213, 0.4)', padding: 12}}>
          <Icon name="caretright" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  ),
);

const MaterialComponent = ({data, idIntervention}) => {
  console.log(idIntervention);
  const [items, setItems] = useState(data);
  const handlePriority = async (id, newPriority) => {
    // Update the priority in the local state
    setItems(
      items.map(item =>
        item.id === id ? {...item, priority: newPriority} : item,
      ),
    );

    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const {uid, ocn_token_key} = JSON.parse(userInfo);

      const payload = {
        id: 30, // Unique ID for the request
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'product.product',
          method: 'set_priority',
          args: [id, newPriority],
          kwargs: {
            context: {
              lang: 'fr_FR',
              tz: 'Africa/Casablanca',
              uid: uid,
              allowed_company_ids: [1],
              active_model: 'project.task',
              active_id: idIntervention,
              active_ids: [idIntervention],
              fsm_mode: true,
              create: true,
              fsm_task_id: idIntervention,
              pricelist: 1,
              hide_qty_buttons: false,
              default_invoice_policy: 'delivery',
            },
          },
        },
      };

      const response = axios.post(
        'http://51.178.136.6:16003/web/dataset/call_kw/product.product/set_priority',
        payload,
        {
          headers: {
            Authorization: `Bearer ${ocn_token_key}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // if (!response.data.result) {
      //   throw new Error('Failed to update priority');
      // }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 0) {
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? {...item, fsm_quantity: newQuantity} : item,
      ),
    );
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeey');
    updateQuantityAPI(id, newQuantity, idIntervention);
  };

  const renderItem = ({item}) => (
    <Item
      id={item.id}
      name={item.name}
      price={item.fsm_partner_price}
      quantity={item.fsm_quantity}
      priority={item.priority}
      onQuantityChange={handleQuantityChange}
      qty_available={item.qty_available}
      idIntervention={idIntervention}
      handlePriority={handlePriority}
    />
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      getItemLayout={(data, index) => ({
        length: 100,
        offset: 100 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'rgba(213, 213, 213, 0.2)',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 16,
    elevation: 1,
  },
  name: {
    fontSize: 18,
    marginLeft: 6,
  },
});

export default MaterialComponent;
