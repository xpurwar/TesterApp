import { Text, View, StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';


export default function AboutScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    const { latitude, longitude } = location.coords;
    text = JSON.stringify(location); // Log the location
    console.log(text);
    console.log("Hello from the console!");
    let region = null;
  

    // Define the map region

  }
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
      showsUserLocation={true}
      followsUserLocation={true}/>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject, // Makes the map fill the container
    },
  });