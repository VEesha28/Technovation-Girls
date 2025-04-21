import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { DataTable } from 'react-native-paper';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];

export default function LanguageHelpScreen() {
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(120);
  const [selectedLanguage1, setSelectedLanguage1] = useState(null);
  const [selectedLanguage2, setSelectedLanguage2] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Foreign Language Help</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={languages}
            labelField="label"
            valueField="value"
            placeholder="Select Language"
            value={selectedLanguage1}
            onChange={(item) => setSelectedLanguage1(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={languages}
            labelField="label"
            valueField="value"
            placeholder="Select Language"
            value={selectedLanguage2}
            onChange={(item) => setSelectedLanguage2(item.value)}
          />
        </View>

        <View style={styles.translationBox}>
          <TextInput
            style={[styles.inputBox, { height: inputHeight }]}
            placeholder="Type a word..."
            value={inputText}
            onChangeText={setInputText}
            multiline={true}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
          />
          <View style={styles.infoBox}>
            <Text>Translated Text here...</Text>
          </View>
        </View>

        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Word</DataTable.Title>
            <DataTable.Title>Translation</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Help is coming</DataTable.Cell>
            <DataTable.Cell>L'aide arrive</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Where is the pain?</DataTable.Cell>
            <DataTable.Cell>Où est la douleur?</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Are you hurt?</DataTable.Cell>
            <DataTable.Cell>Êtes-vous blessé?</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <Text>Menu</Text>
        <Image
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffecec',
  },
  header: {
    backgroundColor: '#f67a7e',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  dropdown: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  translationBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  inputBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '45%',
    backgroundColor: '#fff',
    minHeight: 120,
  },
  infoBox: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  table: {
    width: '90%',
    marginVertical: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#f67a7e',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
