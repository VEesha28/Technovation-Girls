import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import ForeignLangHelp from './screens/ForeignLangHelp.js'; // Import your foreign language help file

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState({
    aiChat: false,
  });
  const [location, setLocation] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Bold': require('./static/Montserrat-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handleLocationShare = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to share your current location.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({ latitude, longitude });

      const locationMessage = `My current location is:\nLatitude: ${latitude}\nLongitude: ${longitude}`;
      const smsUrl = `sms:?body=${encodeURIComponent(locationMessage)}`;
      const emailUrl = `mailto:?subject=My Location&body=${encodeURIComponent(locationMessage)}`;

      Alert.alert(
        'Share Location',
        'How would you like to share your location?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Via SMS', onPress: () => Linking.openURL(smsUrl) },
          { text: 'Via Email', onPress: () => Linking.openURL(emailUrl) },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while fetching your location.');
    }
  };

  const handleCallPress = () => {
    setModalVisible(true);
  };

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <ScrollView style={styles.container}>
      {/* Emergency Helper Heading */}
      <View style={styles.mainHeadingContainer}>
        <Text style={styles.mainHeadingText}>Emergency Helper</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency Helper</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>AI Step-Step Coach</Text>
      </View>

      {/* Foreign Language Help and AI Chat Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={() => navigation.navigate('ForeignLangHelp')} // Redirect to the foreignlanghelp screen
        >
          <Text style={styles.additionalButtonText}>Foreign Language Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={() =>
            setInfoModalVisible((prevState) => ({
              ...prevState,
              aiChat: true,
            }))
          }
        >
          <Text style={styles.additionalButtonText}>AI Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickOptions}>
        <TouchableOpacity style={styles.circle}>
          <Image
            source={{ uri: 'https://clipart-library.com/8300/2368/flashlight-emoji-clipart-xl.png' }}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={handleLocationShare}>
          <Image
            source={{ uri: 'https://clipart-library.com/8300/2368/location-icon-clipart-xl.png' }}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circle} onPress={handleCallPress}>
          <Image
            source={{ uri: 'https://clipart-library.com/image_gallery2/Phone-PNG.png' }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>Foreign Language Help</Text>
      </View>

      {/* Modals for AI Chat */}
      <Modal isVisible={infoModalVisible.aiChat}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>AI Chat</Text>
          <Text>This section connects you to an AI chat for assistance.</Text>
          <TouchableOpacity
            onPress={() =>
              setInfoModalVisible((prevState) => ({
                ...prevState,
                aiChat: false,
              }))
            }
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Emergency Numbers</Text>
          {/* Add emergency number logic here */}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="ForeignLangHelp"
          component={ForeignLangHelp}
          options={{ title: 'Foreign Language Help' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainHeadingContainer: {
    backgroundColor: '#ff69b4',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 100, // Pushes the heading 100 pixels below the top
    alignItems: 'center',
  },
  mainHeadingText: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#f67a7e',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#fefefe',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  infoBox: {
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 20,
    margin: 20,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#fefefe',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 20,
  },
  additionalButton: {
    backgroundColor: '#8b0000',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  additionalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginHorizontal: 10,
  },
  circle: {
    width: 80,
    height: 80,
    backgroundColor: '#8b0000',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 20,
  },
  modalCloseButton: {
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#f67a7e',
    fontFamily: 'Montserrat-Bold',
  },
});
