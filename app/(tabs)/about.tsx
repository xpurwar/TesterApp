import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function AboutScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number>(0); // State to store total distance
  const [speed, setSpeed] = useState<number | null>(null); // State to store current speed
  const [goalDistance, setGoalDistance] = useState<number | null>(null); // State to store user-set goal distance
  const [inputDistance, setInputDistance] = useState<string>(''); // Input field for user distance

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 }, // Update every 5 meters
        (newLocation) => {
          setLocation(newLocation);

          const { latitude, longitude, speed: currentSpeed } = newLocation.coords;
          setPath((prevPath) => {
            const updatedPath = [...prevPath, { latitude, longitude }];

            if (prevPath.length > 0) {
              const lastPoint = prevPath[prevPath.length - 1];
              const newDistance = haversine(lastPoint, { latitude, longitude });
              setDistance((prevDistance) => prevDistance + newDistance);
            }

            return updatedPath;
          });

          setSpeed(currentSpeed);
        }
      );
    }

    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Function to handle user setting a goal distance
  const handleSetGoal = () => {
    const parsedDistance = parseFloat(inputDistance);

    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number for the distance.');
      return;
    }

    setGoalDistance(parsedDistance); // Set the goal distance
    setInputDistance(''); // Clear the input field
    Alert.alert('Goal Set', `Your goal is to run ${parsedDistance.toFixed(2)} km.`);
  };

  const speedInKmH = speed !== null ? (speed * 3.6).toFixed(2) : 'Calculating...'; // Convert m/s to km/h
  const speedInMph = speed !== null ? (speed * 2.23694).toFixed(2) : 'Calculating...'; // Convert m/s to mph

  const progressPercentage = goalDistance ? ((distance / goalDistance) * 100).toFixed(2) : null; // Progress %

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Polyline
          coordinates={path}
          strokeColor="#FF0000"
          strokeWidth={4}
        />
      </MapView>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Total Distance: {distance.toFixed(2)} km</Text>
        <Text style={styles.text}>Speed: {speedInKmH} km/h ({speedInMph} mph)</Text>
        {goalDistance && (
          <Text style={styles.text}>
            Goal: {goalDistance.toFixed(2)} km | Progress: {progressPercentage}% 
          </Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Set your distance goal (km)"
          keyboardType="numeric"
          value={inputDistance}
          onChangeText={setInputDistance}
        />
        <Button title="Set Goal" onPress={handleSetGoal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
