import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router'; 

const Contact = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contacts.Contact | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigation = useNavigation();



  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission d'accès à votre localisation refusé");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#C7EDE6' },
      headerBackTitle: 'Retour',
      headerTitle: () => (
        <Text style={ styles.headerTitle }>URGENCE</Text>
      )
    });
  }, [navigation]);

  const sendEmergencyMessage = async () => {
    if (selectedContact && selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(
          [selectedContact.phoneNumbers[0].number ?? ''],
          "Message d'urgence: J'ai besoin d'aide. S'il vous plaît contactez les urgences. Voici mes coordonnées: Latitude: " + (location?.coords?.latitude ?? '') + " Longitude: " + (location?.coords?.longitude ?? '')
        );
      } else {
        alert('SMS service indisponible sur cette appareil');
      }
    } else {
      alert('Selectionnez un contact svp');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionner un contact:</Text>
      <FlatList
        style={styles.container2}
        data={contacts}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedContact(item)}>
            <Text style={styles.contactItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedContact && (
        <View style={styles.selectedContact}>
          <Text>Contact sélectionné: {selectedContact.name}</Text>
        </View>
      )}
      <Button title="Envoyer le message d'urgence" onPress={sendEmergencyMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'black',
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 20,
    backgroundColor: '#8DBAB2',
    borderWidth: 0.5,
    borderColor: 'black',
  },
  selectedContact: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },

});

export default Contact;
