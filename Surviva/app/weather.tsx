import React, { useState, useEffect, SetStateAction } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from 'expo-router';

const Weather = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<null | { temp: number, humidity: number, wind_speed: number }>(null);
  const [weatherApiData, setWeatherApiData] = useState<null | { temp_c: number, humidity: number, textD: string, condition_icon: string }>(null);
  const [error, setError] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(null);
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

          const weatherUrl = `https://api.api-ninjas.com/v1/weather?lat=${latitude}&lon=${longitude}`;

          const weatherResponse = await axios.get(weatherUrl, {
            headers: {
              'X-Api-Key': apiKey,
            },
          });

          setWeatherData(weatherResponse.data);

          const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=eae678dccf514217812133716242607&q=${latitude},${longitude}&lang=fr`;

          const weatherApiResponse = await axios.get(weatherApiUrl);

          setWeatherApiData({
            temp_c: weatherApiResponse.data.current.temp_c,
            humidity: weatherApiResponse.data.current.humidity,
            textD: weatherApiResponse.data.current.condition.text,
            condition_icon: weatherApiResponse.data.current.condition.icon,
          });
        } else {
          setError(null);
        }
      } catch (error) {
        setError(error as SetStateAction<null>);
        console.error("There was an error fetching the data!", error);
      }
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#C7EDE6' },
      headerBackTitle: 'Retour',
      headerTitle: () => (
        <Text style={ styles.headerTitle }>MÉTÉO</Text>
      )
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.error}>Erreur récupération de données: {error?.message}</Text>
      )}
      {weatherData && weatherApiData ? (
        <View style={styles.container2}>
          <Image
            source={{ uri: `https:${weatherApiData.condition_icon}` }}
            style={styles.weatherIcon}
          />
          <Text style={styles.text}>Ville: {city}</Text>
          <Text style={styles.text}>
            Température : {weatherData?.temp}°C
          </Text>
          <Text style={styles.text}>
            Humidité : {weatherData?.humidity}%
          </Text>
          <Text style={styles.text}>
            Vitesse du vent : {weatherData?.wind_speed} m/s
          </Text>
          <Text style={styles.text}>
            Condition météorologique : {weatherApiData.textD}
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>Chargement des données météo...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C7EDE6',
    borderRadius: 10,
    gap: 30,
    borderWidth: 1.5,
    borderColor: 'black',
    padding: 30,
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
  error: {
    fontSize: 18,
    margin: 10,
    color: 'red',
  },
  weatherIcon: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },
});

export default Weather;
