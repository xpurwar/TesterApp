import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; 
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';

const PlaceholderImage = require('@/assets/images/icon.png');

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Pass style to ImageViewer to resize the icon */}
        <ImageViewer imgSource={PlaceholderImage} style={styles.iconImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

// StyleSheet with adjusted image size
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  // Add style for resizing the icon
  iconImage: {
    width: 50, // Set desired width
    height: 50, // Set desired height
    borderRadius: 10, 
  },
});
