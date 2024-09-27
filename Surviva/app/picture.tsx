import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';

interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
}

export default function Picture() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location as Location.LocationObject);

      const { latitude, longitude } = location.coords;

      const apiKey = 'qxJJpNsBifo9KOn7++FafQ==mp5MPUSO9hbCVipK';
      const geocodingUrl = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${latitude}&lon=${longitude}`;

      try {
        const geoResponse = await axios.get(geocodingUrl, {
          headers: {
            'X-Api-Key': apiKey,
          },
        });

        if (geoResponse.data.length > 0) {
          const cityName = geoResponse.data[0].name;
          setCity(cityName);
        } else {
          setError("City not found");
        }
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setError("Failed to fetch city");
      }
    })();
  }, []);

  useEffect(() => {
    if (!city) {
      return;
    }

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.unsplash.com/search/photos?query=' + city + '&client_id=NmPsK2sh-przTZwKIdMqCtNMzfVKVNBqmMazfSKz_UY');
        const data = await response.json();
        setPhotos(data.results);
      } catch (error) {
        setError('Failed to load photos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [city]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#C7EDE6' },
      headerBackTitle: 'Retour',
      headerTitle: () => (
        <Text style={ styles.headerTitle }>PHOTOS</Text>
      )
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item.urls.small }} style={styles.photo} />
            <Text>{item.alt_description || 'Aucune description...'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  photoContainer: {
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#8DBAB2',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4C877C',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    margin: 20,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },
});
