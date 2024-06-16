import React, {useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MyFlatList = ({data}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <TouchableOpacity onPress={() => handleItemClick(item)} key={index}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.categ_id.length && item.categ_id[1].length > 18
                ? `${item.categ_id[1].slice(0, 18)}...`
                : item.categ_id[1]}
            </Text>
            <Text style={styles.itemText}>
              {item.produit_systeme_id.length &&
              item.produit_systeme_id[1].length > 18
                ? `${item.produit_systeme_id[1].slice(0, 18)}...`
                : item.produit_systeme_id[1]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <Modal
        transparent={true}
        visible={!!selectedItem}
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="times" size={20} color="black" />
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <View style={styles.itemDetailsContainer}>
                <Text style={styles.modalText}>ID: {selectedItem.id}</Text>
                <Text style={styles.modalText}>
                  Ticket ID: {selectedItem.ticket_id[1]}
                </Text>
                <Text style={styles.modalText}>
                  Product System ID: {selectedItem.produit_systeme_id[1]}
                </Text>
                <Text style={styles.modalText}>
                  Category ID: {selectedItem.categ_id[1]}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(0, 0, 255, 0.8)',
                    borderRadius: 20,
                    // opacity: 0.8,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name="refresh"
                    size={20}
                    color="white"
                    style={{marginRight: 5}}
                  />
                  <Text style={{color: 'white'}}>Changement de pièce</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemDetailsContainer: {
    marginBottom: 20,
  },
  itemText: {
    fontSize: 13,
  },
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
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MyFlatList;
