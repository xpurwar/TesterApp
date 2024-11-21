import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';



export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
