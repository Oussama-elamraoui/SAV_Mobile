import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

const Popup = ({
  visible,
  message,
  button1Text,
  button2Text,
  onPressButton1,
  onPressButton2,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.message}>Voulez-vous cloturer l'intervention</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={onPressButton1}>
              <Text style={styles.buttonText}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPressButton2}>
              <Text style={styles.buttonText}>Accepter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'green',
    padding: 6,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Popup;
