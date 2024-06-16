import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
const RenderedItem = ({item, navigation}) => {
  
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('DetailsScreen', {item: item})}>
      <View style={styles.header}>
        <View style={styles.nameSection}>
          <EvilIcons name="gear" size={24} color="black" />
          <Text style={styles.headerText}>
            {item.name.length < 30 ? item.name : `${item.name.slice(0, 25)}...`}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {item.planned_date_begin ? item.planned_date_begin : '-- '} /{' '}
          {item.planned_date_end ? item.planned_date_end : '--'}
          {/* 2018-01-01 - 2018-01-01 */}
        </Text>
      </View>
      <View style={styles.content}>
        <View>
          <Text>
            {item.societe_mere.length
              ? item.societe_mere[1].length > 21
                ? `${item.societe_mere[1].slice(0, 21)}...`
                : item.societe_mere[1]
              : 'No item'}
          </Text>
        </View>
        <View>
          <Text>
            {item.partner_id.length
              ? item.partner_id[1].length > 16
                ? `${item.partner_id[1].slice(0, 16)}...`
                : item.partner_id[1]
              : 'No item'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default RenderedItem;
