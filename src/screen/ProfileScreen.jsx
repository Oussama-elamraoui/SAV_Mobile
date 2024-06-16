import InterventionScreen from './InterventionScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import Header from '../component/ArrowBack';
import UserProfile from '../component/profileComponent';
const ProfileScreen = ({navigation}) => {
  const item = {
    jsonrpc: '2.0',
    id: null,
    result: {
      uid: 2,
      is_system: true,
      is_admin: true,
      user_context: {
        lang: 'fr_FR',
        tz: 'Africa/Casablanca',
        uid: 2,
      },
      db: 'sav',
      server_version: '16.0+e-20240209',
      server_version_info: [16, 0, 0, 'final', 0, 'e'],
      support_url: 'https://www.odoo.com/help',
      name: 'Administrator',
      username: 'admin',
      partner_display_name: 'Administrator',
      company_id: 1,
      partner_id: 3,
      'web.base.url': 'http://51.178.136.6:16003',
      active_ids_limit: 20000,
      profile_session: null,
      profile_collectors: null,
      profile_params: null,
      max_file_upload_size: 134217728,
      home_action_id: false,
      cache_hashes: {
        translations: '48de6a1ce5cd1db57d51136d3217f74f19e0f7c3',
        load_menus:
          'caa98a6517f98d415ceea06cd924e78f3e3fa0d50e7bc31a5a7c664f416d8389',
      },
      currencies: {
        1: {
          symbol: '€',
          position: 'after',
          digits: [69, 2],
        },
        109: {
          symbol: 'DH',
          position: 'after',
          digits: [69, 2],
        },
      },
      bundle_params: {
        lang: 'fr_FR',
      },
      user_companies: {
        current_company: 1,
        allowed_companies: {
          1: {
            id: 1,
            name: 'Unisystem Group',
            sequence: 0,
            timesheet_uom_id: 4,
            timesheet_uom_factor: 1.0,
          },
        },
      },
      show_effect: true,
      display_switch_company_menu: false,
      user_id: [2],
      max_time_between_keys_in_ms: 100,
      session_id: 'ed5d6f5a54daf59e6caf5bc7771d82211c0c70b1',
      is_livreur: false,
      warning: 'admin',
      expiration_date: '2024-06-08 00:00:00',
      expiration_reason: 'renewal',
      web_tours: [],
      tour_disable: false,
      notification_type: 'email',
      map_box_token: false,
      odoobot_initialized: true,
      ocn_token_key: 'bd076d2fbd5646989d9c3e0cb75eff8b',
      fcm_project_id: '186813708685',
      inbox_action: 119,
      iap_company_enrich: false,
      uom_ids: {
        4: {
          id: 4,
          name: 'Heures',
          rounding: 0.01,
          timesheet_widget: 'float_time',
        },
      },
    },
  };
  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} title={'User Info'} />
      <UserProfile userInfo={item} />
    </View>
  );
};
export default ProfileScreen;
