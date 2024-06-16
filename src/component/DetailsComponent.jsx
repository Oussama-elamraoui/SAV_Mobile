import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Header from './ArrowBack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Popup from './PopupModal';
import MyFlatList from './EquipementList';
import RenderHtml from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
// import {BottomSheet, BottomSheetView} from '@gorhom/bottom-sheet';
import BottomModal from './ModalStatus';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DetailsComponent = ({route, navigation}) => {
  const {width} = useWindowDimensions();
  const item = route.params?.item;
  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        // Retrieve user info from storage
        const userInfo = await AsyncStorage.getItem('userInfo');
        const {uid, ocn_token_key} = JSON.parse(userInfo);

        // Construct request payload
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            args: [[item.id], ['system_lines']],
            model: 'project.task',
            method: 'read',
            kwargs: {
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
                bin_size: true,
              },
            },
          },
        };

        // Send request to API using Axios
        const response = await axios.post(
          'http://51.178.136.6:16003/web/dataset/call_kw/project.task/read',
          payload,
          {
            headers: {
              Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
              'Content-Type': 'application/json',
            },
          },
        );

        // console.log(response.data.result[0].system_lines);
        const payloadEquipment = {
          id: 31,
          jsonrpc: '2.0',
          method: 'call',
          params: {
            args: [response.data.result[0].system_lines, []],
            model: 'helpdesk.ticket.lines',
            method: 'read',
            kwargs: {
              context: {
                lang: 'fr_FR',
                tz: 'Africa/Casablanca',
                uid: uid,
                allowed_company_ids: [1],
                bin_size: true,
                fsm_mode: true,
                graph_measure: '__count__',
                graph_groupbys: ['project_id'],
                pivot_measures: ['__count__'],
              },
            },
          },
        };
        const responseEquipment = await axios.post(
          'http://51.178.136.6:16003/web/dataset/call_kw/helpdesk.ticket.lines/read',
          payloadEquipment,
          {
            headers: {
              Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
              'Content-Type': 'application/json',
            },
          },
        );
        // Set tasks state with the received data
        // console.log(responseEquipment.data.result);
        setEquipmentData(responseEquipment.data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when component mounts
    fetchData();
  }, []);
  const stripHtmlTags = html => {
    return html.replace(/<[^>]*>?/gm, ' ');
  };

  const [equipmentData, setEquipmentData] = useState([]);
  const emojisWithIcons = [
    {title: 'Réparation', icon: 'cog-sync-outline', screen: 'Réparation'},
    {title: 'Material', icon: 'toolbox', screen: 'material'},
    {title: 'Changement de pièce', icon: 'compare-horizontal', screen: ''},
    {title: "Motif d'intervention", icon: 'briefcase', screen: ''},
    {title: 'Maj gps', icon: 'map-marker', screen: ''},
    {title: 'Signer Le rapport', icon: 'pencil', screen: ''},
  ];
  const sourceHtml = {
    html: typeof item.description === 'string' ? item.description : '',
  };
  const displayValue =
    typeof item.rapp_diagno === 'string' ? item.rapp_diagno : '';
  const [report, setReport] = useState(stripHtmlTags(displayValue));
  const [rapportUpdated, setRapportUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendReport = async () => {
    setLoading(true);
    // Simulating API call
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const {uid, ocn_token_key} = JSON.parse(userInfo);

      const payload = {
        id: 64,
        jsonrpc: '2.0',
        method: 'call',
        params: {
          args: [
            [item.id],
            {
              rapp_diagno: report,
            },
          ],
          model: 'project.task',
          method: 'write',
          kwargs: {
            context: {
              lang: 'fr_FR',
              tz: 'Africa/Casablanca',
              uid: uid,
              allowed_company_ids: [1],
              params: {
                menu_id: 499,
                action: 752,
                cids: 1,
              },
            },
          },
        },
      };

      const response = await axios.post(
        'http://51.178.136.6:16003/web/dataset/call_kw/project.task/write',
        payload,
        {
          headers: {
            Authorization: `Bearer ${ocn_token_key}`, // Replace with your authorization token
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log(response.data.result);
      if (response.data) {
        Alert.alert('Repport sent', 'Your report has been saved successfully');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again',
      );
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const [popupVisible, setPopupVisible] = useState(false);

  const handleButton1Press = () => {
    // Handle button 1 press action
    setPopupVisible(false); // Close the popup
  };

  const handleButton2Press = () => {
    // Handle button 2 press action
    setPopupVisible(false); // Close the popup
  };
  const [selectedItem, setSelectedItem] = useState('rapport');

  const handleItemClick = item => {
    setSelectedItem(item);
  };
  const [expanded, setExpanded] = useState(false);
  const [selectMenu, setSelectMenu] = useState(false);
  const CloseModalMenu = () => {
    setSelectMenu(!selectMenu);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header navigation={navigation} title={'Intervention Details'} />
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity
                onPress={CloseModalMenu}
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Icon name="menu" color={'grey'} size={20} />
                <Text style={{fontSize: 16, marginLeft: 4}}>Menu</Text>
              </TouchableOpacity>
              {/* <Dropdown label="Favorite Fruit" data={data}/> */}
            </View>
            <View>
              {item.stage_id.length &&
                (item.stage_id[1] == 'cloturé' ? (
                  <TouchableOpacity
                    onPress={() => setPopupVisible(true)}
                    style={{
                      backgroundColor: 'rgba(190, 248, 190, 0.6)',
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 5,
                    }}>
                    <Text style={{color: 'rgb(72, 184, 72)'}}>
                      {item.stage_id[1]}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setPopupVisible(true)}
                    style={{
                      backgroundColor: 'rgba(255, 237, 180, 0.6)',
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 5,
                    }}>
                    <Text style={{color: 'rgb(227, 193, 86)'}}>
                      {item.stage_id[1]}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
        <View
          style={
            expanded
              ? styles.containerDetailsOpened
              : styles.containerDetailsClosed
          }>
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginRight: 10}}>
              <Text style={styles.value}>{item.name}</Text>
            </Text>
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="rgba(128,128,128,0.6)"
            />
          </TouchableOpacity>

          {expanded && (
            <View>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(128,128,128,0.3)', // Grey color with 50% opacity
                  marginHorizontal: 2,
                  marginTop: 10,
                }}
              />

              <View
                style={{
                  // flex: 1,
                  marginTop: 5,
                }}>
                {/* <View style={styles.itemContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{item.name}</Text>
                </View> */}
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Project ID:</Text>
                  <Text style={styles.value}>
                    {item.project_id && item.project_id[1]}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Societe Mere:</Text>
                  <Text style={styles.value}>
                    {item.societe_mere && item.societe_mere[1]}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Partner ID:</Text>
                  <Text style={styles.value}>
                    {item.partner_id && item.partner_id[1]}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>User IDs:</Text>
                  <Text style={styles.value}>
                    {item.user_ids && item.user_ids.join(', ')}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Planned Date Begin:</Text>
                  <Text style={styles.value}>
                    {item.planned_date_begin
                      ? item.planned_date_begin
                      : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Planned Date End:</Text>
                  <Text style={styles.value}>
                    {item.planned_date_end
                      ? item.planned_date_end
                      : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Activity IDs:</Text>
                  <Text style={styles.value}>
                    {item.activity_ids && item.activity_ids.join(', ')}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>BL Number:</Text>
                  <Text style={styles.value}>
                    {item.bl_number ? item.bl_number : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>State:</Text>
                  <Text style={styles.value}>
                    {item.state ? item.state : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Type ID:</Text>
                  <Text style={styles.value}>
                    {item.type_id ? item.type_id : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Type Interv:</Text>
                  <Text style={styles.value}>{item.type_interv}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Code Agency:</Text>
                  <Text style={styles.value}>{item.code_agency}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Team ID:</Text>
                  <Text style={styles.value}>
                    {item.team_id && item.team_id[1]}
                  </Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Partner Phone:</Text>
                  <Text style={styles.value}>
                    {item.partner_phone ? item.partner_phone : 'Not specified'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.item,
                selectedItem === 'rapport' && styles.selectedItem,
              ]}
              onPress={() => handleItemClick('rapport')}>
              <Text style={styles.itemText}>Rapport</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.item,
                selectedItem === 'system' && styles.selectedItem,
              ]}
              onPress={() => handleItemClick('system')}>
              <Text style={styles.itemText}>Equipement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.item,
                selectedItem === 'email' && styles.selectedItem,
              ]}
              onPress={() => handleItemClick('email')}>
              <Text style={styles.itemText}>Email</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          {/* Display specific view based on selectedItem */}
          {selectedItem === 'system' && (
            <View>
              <Text
                style={{fontSize: 14, fontWeight: 'bold', marginVertical: 10}}>
                System/Equipement:
              </Text>
              <MyFlatList data={equipmentData} />
            </View>
          )}
          {selectedItem === 'rapport' && (
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                Rapport diagnostique:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Write your report here..."
                multiline
                value={report}
                onChangeText={setReport}
                editable={!loading}
              />
              <TouchableOpacity onPress={sendReport} disabled={rapportUpdated}>
                {loading ? (
                  <View
                    style={{
                      alignItems: 'center',
                      // paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: '#4CAF50',
                      justifyContent: 'center',
                      // paddingVertical: 10,
                      minHeight: 40,
                    }}>
                    <ActivityIndicator size={25} color="#4CAF50" />
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: '#4CAF50',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // paddingVertical: 10,
                      borderRadius: 10,
                      minHeight: 40,
                    }}>
                    <Text style={{color: 'white', fontSize: 14}}>
                      Send Report
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {/* <Button
                title="Send Report"
                onPress={sendReport}
                color="#4CAF50"
                disabled={report.length < 1 ? true : false}
              /> */}
            </View>
          )}
          {selectedItem === 'email' && (
            <View>
              <Text
                style={{fontSize: 14, fontWeight: 'bold', marginVertical: 10}}>
                Email de demande:
              </Text>
              <View style={styles.input}>
                <RenderHtml source={sourceHtml} contentWidth={width} />
              </View>
            </View>
          )}
        </View>
        <BottomModal visible={modalVisible} onClose={toggleModal} />
        <Popup
          visible={popupVisible}
          message="This is a message in the popup"
          button1Text="Button 1"
          onPressButton1={handleButton1Press}
          button2Text="Button 2"
          onPressButton2={handleButton2Press}
        />
        <Modal
          transparent={true}
          visible={selectMenu}
          animationType="slide"
          onRequestClose={CloseModalMenu}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {emojisWithIcons.map((i, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, {justifyContent: 'space-between'}]}
                  onPress={() =>
                    i.title == 'Réparation'
                      ? (CloseModalMenu(),
                        navigation.navigate('ReparationScreen', {id: item.helpdesk_ticket_id[0],idClient:item.partner_id[0],idItervention:item.id}))
                      : i.title === 'Maj gps'
                      ? (CloseModalMenu(), navigation.navigate('MapsScreen'))
                      : (i.title = 'material'
                          ? (CloseModalMenu(),
                            navigation.navigate('MaterialScreen', {
                              id: item.id,
                            }))
                          : CloseModalMenu())
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name={i.icon} size={24} color="#333" />
                    <Text style={styles.menuItemText}>{i.title}</Text>
                  </View>
                  {i.title == 'Réparation' && (
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      {' '}
                      {item.repair_count}{' '}
                    </Text>
                  )}
                  {i.title == 'Material' && (
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                      {item.material_line_product_count} Produit/{' '}
                      {item.material_line_total_price}Dh
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    elevation: 5,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  containerDetailsOpened: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  containerDetailsClosed: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    flex: 1,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  animation: {
    width: 'auto',
    height: 50,
  },
  animationResult: {
    height: 20,
  },
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  dropdownButtonStyle: {
    width: 180,
    height: 50,
    // backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectedItem: {
    backgroundColor: 'rgba(96, 167, 206, 0.4)',
  },
  itemText: {
    fontSize: 15,
    color: 'rgb(96, 167, 206)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.3)',
  },
  selectedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default DetailsComponent;
