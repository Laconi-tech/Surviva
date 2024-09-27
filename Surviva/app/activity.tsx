import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from 'expo-router';

const Activity = () => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [stepCount, setStepCount] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    Accelerometer.setUpdateInterval(200);

    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      detectStep(accelerometerData);
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#C7EDE6' },
      headerBackTitle: 'Retour',
      headerTitle: () => (
        <Text style={ styles.headerTitle }>ACTIVITÉ</Text>
      )
    });
  }, [navigation]);

  const detectStep = ({ x, y, z }: { x: number, y: number, z: number }) => {
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const threshold = 1.35;

    if (acceleration > threshold) {
      if (!isWalking) {
        setIsWalking(true);
        setStepCount(prevStepCount => prevStepCount + 1);
      }
    } else {
      setIsWalking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nombre de pas :</Text>
      <Text style={styles.textPas}>{stepCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    margin: 10,
  },
  textPas: {
    fontSize: 74,
    margin: 10,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    color: '#333',
  },
});

export default Activity;