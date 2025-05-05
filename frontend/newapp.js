import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import Torch from 'react-native-torch';
import * as Location from 'expo-location';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';

export default function App() {
  const [isMetronomeVisible, setMetronomeVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const emergencyNumbers = [
    { name: '911 (USA)', number: '19732238901' },
    { name: 'Poison Control (USA)', number: '19732238901' },
    { name: 'Choking Hotline', number: '19732238901' },
    { name: '112 (Europe)', number: '19732238901' },
    { name: '999 (UK)', number: '19732238901' },
    { name: '000 (Australia)', number: '16174688615' },
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

  const startPulsing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleMetronomePress = () => {
    setMetronomeVisible(true);
    startPulsing();
  };

  const handleLocationShare = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permissions are required.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    Alert.alert('Location Shared', JSON.stringify(location));
  };

  const handleCallPress = () => {
    setModalVisible(true);
  };

  const handleNumberPress = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency App</Text>
      </View>

      <View style={styles.quickOptions}>
        <TouchableOpacity style={styles.circle} onPress={handleMetronomePress}>
          <Image
            source={{ uri: 'https://clipground.com/images/cpr-training-clipart-16.png' }}
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

      <Modal isVisible={isMetronomeVisible}>
        <View style={styles.modalContent}>
          <Animated.View
            style={[
              styles.pulsingCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Text style={styles.message}>
            Push down 2 inches deep. Stay on the beat: 120 BPM.
          </Text>
          <TouchableOpacity
            onPress={() => setMetronomeVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalCloseButton}
          >
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
  },
  pulsingCircle: {
    width: 150,
    height: 150,
    backgroundColor: '#f67a7e',
    borderRadius: 75,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
