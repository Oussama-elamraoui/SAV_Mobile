import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you have installed react-native-vector-icons

const AccordionItem = ({title, content}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{marginBottom: 10}}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginRight: 10}}>
          {title}
        </Text>
        <Icon
          name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {expanded && {content}}
    </View>
  );
};

export default AccordionItem;
