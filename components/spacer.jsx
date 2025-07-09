import React from 'react';
import { View } from 'react-native';


const Spacer = ({ height = 100 }) => {
  return (
    <View style={{ height: height }} />
  );
};

export default Spacer;