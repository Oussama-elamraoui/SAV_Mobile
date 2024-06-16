import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Button,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateItem = ({idClient, idItervention}) => {
  const [form, setForm] = useState({
    priority: '0',
    description: '',
    product_id: false,
    product_qty: 1,
    product_uom: false,
    partner_id: idClient,
    sale_order_id: false,
    picking_id: false,
    schedule_date: false,
    user_id: 0,
    location_id: false,
    guarantee_limit: false,
    invoice_method: 'none',
    pricelist_id: 1,
    tag_ids: [],
    operations: [],
    fees_lines: [],
    internal_notes: false,
    quotation_notes: false,
  });

  const [products, setProducts] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pickings, setPickings] = useState([]);
  const [tags, setTags] = useState([]);
  const [showScheduleDatePicker, setShowScheduleDatePicker] = useState(false);
  const [showGuaranteeLimitPicker, setShowGuaranteeLimitPicker] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const {uid, ocn_token_key} = JSON.parse(userInfo);
        const payloadProduct = {
          id: 26,
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'product.product',
            method: 'name_search',
            args: [],
            kwargs: {
              name: '',
              operator: 'ilike',
              args: [
                '&',
                ['type', 'in', ['product', 'consu']],
                '|',
                ['company_id', '=', 1],
                ['company_id', '=', false],
              ],
              limit: 8,
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
              },
            },
          },
        };

        const payloadUnity = {
          id: 38,
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'uom.uom',
            method: 'name_search',
            args: [],
            kwargs: {
              name: '',
              operator: 'ilike',
              args: [['category_id', '=', 1]],
              limit: 8,
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
              },
            },
          },
        };
        const [
          productsResponse,
          uomsResponse,
          // locationsResponse,
          // pickingsResponse,
          // tagsResponse,
        ] = await Promise.all([
          axios.post(
            'http://51.178.136.6:16003/web/dataset/call_kw/product.product/name_search',
            payloadProduct,
            {
              headers: {
                Authorization: `Bearer ${ocn_token_key}`, //Replace with your authorization token
                'Content-Type': 'application/json',
              },
            },
          ),
          axios.post(
            'http://51.178.136.6:16003/web/dataset/call_kw/uom.uom/name_search',
            payloadUnity,
            {
              headers: {
                Authorization: `Bearer ${ocn_token_key}`, //Replace with your authorization token
                'Content-Type': 'application/json',
              },
            },
          ),
          // axios.get('API_URL/locations'),
          // axios.get('API_URL/pickings'),
          // axios.get('API_URL/tags'),
        ]);
        console.log(productsResponse.data);
        console.log(uomsResponse.data);
        setProducts(productsResponse.data.result);
        setUoms(uomsResponse.data.result);
        // setLocations(locationsResponse.data);
        // setPickings(pickingsResponse.data);
        // setTags(tagsResponse.data data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (name, value) => {
    setForm({...form, [name]: value});
  };
  const [descriptionRequired, setDescriptionRequired] = useState(false);
  const handleSubmit = async () => {
    if (form.description == '') {
      setDescriptionRequired(true);
      return;
    }
    setDescriptionRequired(false);
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const {uid, ocn_token_key} = JSON.parse(userInfo);
      setForm({...form, user_id: uid});
      const payload = {
        id: 138,
        jsonrpc: '2.0',
        method: 'call',
        params: {
          args: [form],
          model: 'repair.order',
          method: 'create',
          kwargs: {
            context: {
              lang: 'fr_FR',
              tz: 'Africa/Casablanca',
              uid: uid,
              allowed_company_ids: [1],
              active_model: 'helpdesk.ticket.lines',
              active_id: idItervention,
              active_ids: [idItervention],
              default_project_task_id: 606,
              default_user_id: uid,
              default_partner_id: idClient,
              default_ticket_id: 612,
              default_product_id: form.partner_id,
              default_categ_id: 14,
            },
          },
        },
      };
      const response = await axios.post(
        'http://51.178.136.6:16003/web/dataset/call_kw/repair.order/create',
        payload,
        {
          headers: {
            Authorization: `Bearer ${ocn_token_key}`, //Replace with your authorization token
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('gooooooooooooooooooood', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(product =>
    product[1].toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <ScrollView style={{padding: 20}}>
      <View style={{marginBottom: 10}}>
        <Text>Description:</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'rgba(128, 128, 128, 0.3)',
            borderRadius: 10,
          }}
          onChangeText={text => handleInputChange('description', text)}
          value={form.description}
          required
        />
        {descriptionRequired && (
          <Text style={{color: 'red', fontSize: 13}}>
            Description is required
          </Text>
        )}
      </View>
      <Text>Product:</Text>
      <Picker
        style={{backgroundColor: 'rgba(128, 128, 128, 0.1)', borderRadius: 10}}
        selectedValue={form.product_id}
        onValueChange={value => handleInputChange('product_id', value)}>
        {products.map((product, index) => (
          <Picker.Item key={index} label={product[1]} value={product[0]} />
        ))}
      </Picker>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '40%'}}>
          <Text>Quantity:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              marginBottom: 10,
              borderColor: 'rgba(128, 128, 128, 0.3)',
              borderRadius: 10,
            }}
            keyboardType="numeric"
            onChangeText={text =>
              handleInputChange('product_qty', parseInt(text))
            }
            value={form.product_qty.toString()}
          />
        </View>
        <View style={{width: '40%'}}>
          <Text>Unit of Measure:</Text>
          <Picker
            style={{
              backgroundColor: 'rgba(128, 128, 128, 0.1),   borderRadius:10',
            }}
            selectedValue={form.product_uom}
            onValueChange={value => handleInputChange('product_uom', value)}>
            {uoms.map((uom, index) => (
              <Picker.Item key={index} label={uom[1]} value={uom[0]} />
            ))}
          </Picker>
        </View>
      </View>

      {/* <Text>Schedule Date:</Text>
      <Button
        title="Select Date"
        onPress={() => setShowScheduleDatePicker(true)}
      />
      {showScheduleDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowScheduleDatePicker(false);
            handleInputChange('schedule_date', selectedDate);
          }}
        />
      )}

      <Text>
        {form.schedule_date
          ? form.schedule_date.toDateString()
          : 'No date selected'}
      </Text>*/}

      {/* <Text>Guarantee Limit:</Text>
      <Button
        title="Select Date"
        onPress={() => setShowGuaranteeLimitPicker(true)}
      />
      {showGuaranteeLimitPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowGuaranteeLimitPicker(false);
            handleInputChange('guarantee_limit', selectedDate);
          }}
        />
      )}
      <Text>
        {form.guarantee_limit
          ? form.guarantee_limit.toDateString()
          : 'No date selected'}
      </Text> */}

      <Text>Invoice Method:</Text>
      <Picker
        style={{backgroundColor: 'rgba(128, 128, 128, 0.1)', borderRadius: 10}}
        selectedValue={form.invoice_method}
        onValueChange={value => handleInputChange('invoice_method', value)}>
        <Picker.Item label="Pas de facture" value="none" />
        <Picker.Item label="Avant la réparation" value="b4repair" />
        <Picker.Item label="Après la réparation" value="after_repair" />
      </Picker>

      {/* <Text>Location:</Text>
      <Picker
        selectedValue={form.location_id}
        onValueChange={value => handleInputChange('location_id', value)}>
        {locations.map(location => (
          <Picker.Item
            key={location.id}
            label={location.name}
            value={location.id}
          />
        ))}
      </Picker> */}

      {/* <Text>Picking:</Text>
      <Picker
        selectedValue={form.picking_id}
        onValueChange={value => handleInputChange('picking_id', value)}>
        {pickings.map(picking => (
          <Picker.Item
            key={picking.id}
            label={picking.name}
            value={picking.id}
          />
        ))}
      </Picker> */}

      {/* <Text>Tags:</Text>
      <Picker
        selectedValue={form.tag_ids}
        onValueChange={value => handleInputChange('tag_ids', value)}
        multiple={true}>
        {tags.map(tag => (
          <Picker.Item key={tag.id} label={tag.name} value={tag.id} />
        ))}
      </Picker> */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: 'blue',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
        onPress={handleSubmit}>
        <Text style={{color: 'white', fontFamily: 'bold', fontSize: 15}}>
          Create
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateItem;
