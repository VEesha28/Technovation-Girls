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
import Torch from 'react-native-torch';
import * as Location from 'expo-location';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';

import { Card } from 'react-native-paper';
// or any files within the Snack
import AssetExample from './components/AssetExample';

export default function App() {
  const [isFlashlightOn, setFlashlightOn] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const emergencyNumbers = [
    { name: '911 (USA)', number: '19732238901' }, //make sure to change back to 911 later
    { name: 'Poison Control (USA)', number: '19732238901' }, //18002221222
    { name: 'Choking Hotline', number: '19732238901' }, //18008354747
    { name: '112 (Europe)', number: '19732238901' }, //112
    { name: '999 (UK)', number: '19732238901' }, //999
    { name: '000 (Australia)', number: '16174688615' }, //000
  ];

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Bold': require('./frontend/static/Montserrat-Bold.ttf'), 
    });
    setFontsLoaded(true);
  };

  const handleFlashlightPress = () => {
    try {
      setFlashlightOn(!isFlashlightOn);
      Torch.switchState(!isFlashlightOn);
    } catch (error) {
      Alert.alert('Error', 'Flashlight functionality is not supported on this device.');
    }
  };

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

  const handleNumberPress = (number) => {
    const phoneNumber = `tel:${number}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', `Phone call functionality is not supported for number: ${number}`);
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(() =>
        Alert.alert('Error', 'An unexpected error occurred while trying to make a call.')
      );
  };

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency Helper</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>AI Step-Step Coach</Text>
      </View>

      <View style={styles.options}>
        <View style={styles.optionCard}>
          <Text style={styles.optionText}>CPR</Text>
        </View>
        <View style={styles.optionCard}>
          <Text style={styles.optionText}>Hemlich Maneuver</Text>
        </View>
      </View>

      <View style={styles.quickOptions}>
        <TouchableOpacity style={styles.circle} onPress={handleFlashlightPress}>
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

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Emergency Numbers</Text>
          {emergencyNumbers.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalButton}
              onPress={() => handleNumberPress(item.number)}
            >
              <Text style={styles.modalButtonText}>
                {item.name} - {item.number}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  optionCard: {
    backgroundColor: '#8b0000',
    borderRadius: 16,
    padding: 30,
    width: '45%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fefefe',
    fontSize: 20,
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
  modalButton: {
    padding: 10,
    backgroundColor: '#f67a7e',
    marginVertical: 5,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
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
