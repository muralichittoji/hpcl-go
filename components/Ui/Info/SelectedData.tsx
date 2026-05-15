import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const SelectedData = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sample Data</Text>
    </View>
  );
};

export default SelectedData;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'left',
  },
});
