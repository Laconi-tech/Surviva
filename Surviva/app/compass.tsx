import React, { useState, useEffect } from 'react';
import { Image, View, Text, Dimensions, StyleSheet } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';  


const { height, width } = Dimensions.get('window');

type MagnetometerData = {
  x: number;
  y: number;
  z: number;
};

type LocationState = Location.LocationObject | null;

const Compass = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const [location, setLocation] = useState<LocationState>(null);
  const navigation = useNavigation();


  useEffect(() => {
    _toggle();
    _getLocation();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      console.log('Permission de localisation refusée');
    }
  };

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data: MagnetometerData) => {
        setMagnetometer(_angle(data));
      })
    );
    Magnetometer.setUpdateInterval(1000);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _angle = (magnetometer: MagnetometerData) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const _direction = (degree: number) => {
    if (degree >= 22.5 && degree < 67.5) {
      return 'NE';
    } else if (degree >= 67.5 && degree < 112.5) {
      return 'E';
    } else if (degree >= 112.5 && degree < 157.5) {
      return 'SE';
    } else if (degree >= 157.5 && degree < 202.5) {
      return 'S';
    } else if (degree >= 202.5 && degree < 247.5) {
      return 'SW';
    } else if (degree >= 247.5 && degree < 292.5) {
      return 'W';
    } else if (degree >= 292.5 && degree < 337.5) {
      return 'NW';
    } else {
      return 'N';
    }
  };

  const _degree = (magnetometer: number) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#C7EDE6' },
      headerBackTitle: 'Retour',
      headerTitle: () => (
        <Text style={ styles.headerTitle }>BOUSSOLE</Text>
      )
    });
  }, [navigation]);

  return (
    <Grid style={styles.grid}>
      <Row style={{ alignItems: 'center' }} size={0.9}>
        <Col style={{ alignItems: 'center' }}>
          <Text style={styles.text}>
            {_direction(_degree(magnetometer))}
          </Text>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={0.1}>
        <Col style={{ alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: width, alignItems: 'center', top: 0 }}>
            <Image source={require('./(composants)/assets/compass_pointer.png')} style={styles.pointer} />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={2}>
        <Text style={styles.degreeText}>
          {_degree(magnetometer)}°
        </Text>
        <Col style={{ alignItems: 'center' }}>
          <Image source={require("./(composants)/assets/compass_bg.png")} style={[styles.compass, { transform: [{ rotate: 360 - magnetometer + 'deg' }] }]} />
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={1}>
        <Col style={{ alignItems: 'center' }}>
          <Text style={styles.copyright}>Omnes viae Romam ducunt</Text>
        </Col>
      </Row>
    </Grid>
  );
};

const styles = StyleSheet.create({
  grid: {
    backgroundColor: 'black',
  },
  text: {
    color: '#fff',
    fontSize: height / 26,
    fontWeight: 'bold',
  },
  pointer: {
    height: height / 26,
    resizeMode: 'contain',
  },
  degreeText: {
    color: '#fff',
    fontSize: height / 27,
    width: width,
    position: 'absolute',
    textAlign: 'center',
  },
  compass: {
    height: width - 80,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  copyright: {
    color: '#fff',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },
});

export default Compass;
