import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';


export default function Maps() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigation = useNavigation();


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
        <Text style={styles.headerTitle}>CARTE</Text>
      )
    });
  }, [navigation]);

  let text = 'Surviva vous localise...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Votre Localisation"
          />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  text: {
    margin: 10,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },
});