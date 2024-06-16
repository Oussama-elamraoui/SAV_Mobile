import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReparationList = ({data, navigation, idClient, idItervention}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}>
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.product_uom[1]}: {item.product_uom[0]}
          </Text>
        </View>
        <View style={styles.itemSubDetails}>
          <View style={styles.itemRow}>
            <Icon name="circle" color="grey" style={styles.icon} size={10} />
            <Text style={styles.itemText}>
              {item.product_id[1] ? item.product_id[1] : 'no specific product'}
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Icon name="circle" color="grey" size={10} style={styles.icon} />
            <Text style={styles.itemText}>
              {item.schedule_date ? item.schedule_date : 'No specific date'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddReparationScreen', {
              idClient: idClient,
              idItervention: idItervention,
            })
          }>
          <Icon name="plus" size={20} color="white" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalSeparator} />
              <Text style={styles.modalText}>
                Name:{' '}
                <Text style={styles.modalHighlight}>
                  {selectedItem && selectedItem.name}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Schedule Date:{' '}
                <Text style={styles.modalHighlight}>
                  {selectedItem && selectedItem.schedule_date}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Product ID:{' '}
                <Text style={styles.modalHighlight}>
                  {selectedItem && selectedItem.product_id[1]}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Description:{' '}
                <Text style={styles.modalHighlight}>
                  {selectedItem && selectedItem.description}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    margin: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addIcon: {
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemDetails: {
    fontSize: 13,
  },
  itemSubDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  itemText: {
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalContent: {
    flex: 1,
  },
  closeButton: {
    alignItems: 'flex-end',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: 'grey',
    opacity: 0.2,
    marginBottom: 20,
    marginTop: 6,
  },
  modalText: {
    fontSize: 14,
  },
  modalHighlight: {
    color: 'black',
    fontSize: 16,
  },
});

export default ReparationList;
