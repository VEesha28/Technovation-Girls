import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import * as Font from 'expo-font';

import AIChatScreen from './AIPage';

const languageOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
];

const emergencyNumbers = [
  { name: '911 (USA)', number: '911' },
  { name: 'Poison Control (USA)', number: '18002221222' },
  { name: 'Choking Hotline', number: '18008354747' },
  { name: '112 (Europe)', number: '112' },
  { name: '999 (UK)', number: '999' },
  { name: '000 (Australia)', number: '000' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [isModalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Montserrat-Bold': require('./frontend/static/Montserrat-Bold.ttf'), 
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Error loading fonts:', error);
      setFontsLoaded(true); // Continue even if fonts fail to load
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

      const locationMessage = `My current location is:\nLatitude: ${latitude}\nLongitude: ${longitude} someone in my vicinity is in danger`;
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

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await fetch('https://technovation1.onrender.com/api/translate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translated_text || 'Error occurred.');
      } else {
        const errorData = await response.json();
        setTranslatedText(`Error: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      setTranslatedText(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const phrases = [
    { original: 'Hello', translated: { 'en': 'Hello', 'es': 'Hola', 'fr': 'Bonjour', 'de': 'Hallo', 'ta': 'வணக்கம்', 'hi': 'नमस्ते', 'zh': '你好', 'ar': 'مرحباً', 'ja': 'こんにちは', 'ko': '안녕하세요' } },
    { original: 'Where is the hospital?', translated: { 'en': 'Where is the hospital?', 'es': '¿Dónde está el hospital?', 'fr': 'Où est l\'hôpital?', 'de': 'Wo ist das Krankenhaus?', 'ta': 'சமூக மருத்துவ மையம் எங்கே?', 'hi': 'अस्पताल कहाँ है?', 'zh': '医院在哪里？', 'ar': 'أين هو المستشفى؟', 'ja': '病院はどこですか？', 'ko': '병원이 어디에 있나요?' } },
    { original: 'I need help', translated: { 'en': 'I need help', 'es': 'Necesito ayuda', 'fr': 'J\'ai besoin d\'aide', 'de': 'Ich brauche Hilfe', 'ta': 'எனக்கு உதவி வேண்டும்', 'hi': 'मुझे मदद की आवश्यकता है', 'zh': '我需要帮助', 'ar': 'أحتاج إلى مساعدة', 'ja': '助けが必要です', 'ko': '도움이 필요해요' } },
    { original: 'Call the police', translated: { 'en': 'Call the police', 'es': 'Llama a la policía', 'fr': 'Appelez la police', 'de': 'Rufen Sie die Polizei', 'ta': 'போலீசை அழைக்கவும்', 'hi': 'पुलिस को कॉल करें', 'zh': '打电话给警察', 'ar': 'اتصل بالشرطة', 'ja': '警察を呼んでください', 'ko': '경찰에 전화하세요' } }
  ];

  const renderPhrases = () => {
    return phrases.map((phrase, index) => (
      <View key={index} style={styles.phraseContainer}>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>English: </Text>
          {phrase.original}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>
            {targetLang.toUpperCase()}: 
          </Text>{" "}
          {phrase.translated[targetLang] || phrase.translated['en'] || 'N/A'}
        </Text>
      </View>
    ));
  };

  if (!fontsLoaded) {
    return null;
  }

  // Render AI Chat Screen if selected
  if (currentScreen === 'aiChat') {
    return <AIChatScreen onBack={() => setCurrentScreen('main')} />;
  }

  // Render main screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>First Aid Assistant</Text>
        </View>

        <TouchableOpacity 
          style={styles.infoBox}
          onPress={() => setCurrentScreen('aiChat')}
        >
          <Text style={styles.sectionTitle}>AI Step-by-Step Coach</Text>
        </TouchableOpacity>

        <View style={styles.options}>
          <View style={styles.optionCard}>
            <Text style={styles.optionText}>CPR</Text>
          </View>
          <View style={styles.optionCard}>
            <Text style={styles.optionText}>Symptom Checker</Text>
          </View>
        </View>

        <View style={styles.quickOptions}>
          <TouchableOpacity style={styles.circle} onPress={handleLocationShare}>
            <Text style={styles.icon}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.circle} onPress={() => setModalVisible(true)}>
            <Text style={styles.icon}>📞</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>Foreign Language Help</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter text to translate"
            value={text}
            onChangeText={setText}
          />
          <Picker
            selectedValue={sourceLang}
            style={styles.picker}
            onValueChange={(itemValue) => setSourceLang(itemValue)}
          >
            {languageOptions.map((lang) => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>

          <Picker
            selectedValue={targetLang}
            style={styles.picker}
            onValueChange={(itemValue) => setTargetLang(itemValue)}
          >
            {languageOptions.map((lang) => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>

          <Button title="Translate" onPress={handleTranslate} />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.translatedText}>{translatedText}</Text>
          )}
        </View>

        <View style={styles.phraseCard}>
          <Text style={styles.phraseTitle}>Common Phrases</Text>
          {renderPhrases()}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#8b0000',
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
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  circle: {
    backgroundColor: '#f67a7e',
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
    color: '#fefefe',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
  },
  translatedText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#f67a7e',
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },  
  phraseTitle: {
    fontSize: 24,
    color: '#f67a7e',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  phraseCard: {
    backgroundColor: '#8b0000',
    padding: 15,
    marginVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 18,
    color: '#f67a7e',
    textAlign: 'center',
  },
  phraseContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});
