import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine'; // Import haversine formula package

export default function AboutScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number>(0); // State to store total distance
  const [speed, setSpeed] = useState<number | null>(null)

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start watching the user's location
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 }, // Update every 5 meters
        (newLocation) => {
          setLocation(newLocation);

          // Update the path with the new coordinates
          const { latitude, longitude, speed: currentSpeed} = newLocation.coords;
          setPath((prevPath) => {
            const updatedPath = [...prevPath, { latitude, longitude }];

            // Calculate distance if there's at least one previous point
            if (prevPath.length > 0) {
              const lastPoint = prevPath[prevPath.length - 1];
              const newDistance = haversine(lastPoint, { latitude, longitude });
              setDistance((prevDistance) => prevDistance + newDistance);
            }

            return updatedPath;
          });
          setSpeed(currentSpeed)
        }
      );
    }

    startTracking();

    return () => {
      // Cleanup: stop watching location
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location); // Log the location
    console.log(text);
    console.log('Hello from the console!');
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Render the Polyline for the user's path */}
        <Polyline
          coordinates={path}
          strokeColor="#FF0000" // Red path
          strokeWidth={4}
        />
      </MapView>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Total Distance: {distance.toFixed(2)} km
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Makes the map fill the container
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
