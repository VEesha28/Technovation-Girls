import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
// You can import supported modules from npm
import { Card } from 'react-native-paper';
// or any files within the Snack
import AssetExample from './components/AssetExample';

export default function App() {
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
          <Text style={styles.optionText}>Hemlick Maneuver</Text>
        </View>
      </View>

      <View style={styles.quickOptions}>
        <View style={styles.circle}>
          <Image
            source={{ uri: 'https://clipart-library.com/8300/2368/flashlight-emoji-clipart-xl.png' }}
            style={styles.icon}
          />
        </View>
        <View style={styles.circle}>
          <Image
            source={{ uri: 'https://clipart-library.com/8300/2368/location-icon-clipart-xl.png' }}
            style={styles.icon}
          />
        </View>
        <View style={styles.circle}>
          <Image
            source={{ uri: 'https://clipart-library.com/image_gallery2/Phone-PNG.png' }}
            style={styles.icon}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>Foreign Language Help</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // fallback while loading background image
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
});
