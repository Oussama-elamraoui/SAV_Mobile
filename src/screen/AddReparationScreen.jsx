import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from '../component/ArrowBack';
import CreateItem from '../component/reparation/newReparation';
const AddReparationScreen = ({navigation, route}) => {
  const idClient = route.params?.idClient;
  const idItervention = route.params?.idItervention;
  return (
    <>
      <Header navigation={navigation} title={"Creation d'une reparation"} />
      <CreateItem idClient={idClient} idItervention={idItervention} />
    </>
  );
};

export default AddReparationScreen;