import { Text, View, Image, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Font from 'expo-font';

export default function Index() {
  const navigation = useNavigation();
  const [emoji, setEmoji] = useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'NatureFont': require('./(composants)/assets/fonts/Nature.ttf'),
        'YamFont': require('./(composants)/assets/fonts/YeyskRegular-JzaM.otf'),
        'SpaceFont': require('./(composants)/assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const fetchEmoji = async () => {
      try {
        const response = await axios.get('https://api.api-ninjas.com/v1/emoji?name=tree', {
          headers: {
            'X-Api-Key': 'qxJJpNsBifo9KOn7++FafQ==mp5MPUSO9hbCVipK'
          }
        });
        if (response.data && response.data.length > 0) {
          const fetchedEmoji = response.data[0].character;
          setEmoji(fetchedEmoji);
          navigation.setOptions({
            headerStyle: { backgroundColor: '#C7EDE6' },
            headerTitle: () => (
              <Text style={fontsLoaded ? styles.headerTitle : null}>SURVIVA {fetchedEmoji}</Text>
            )
          });
        }
      } catch (error) {
        console.error("Error fetching emoji:", error);
      }
    };

    fetchEmoji();
  }, [navigation, fontsLoaded]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡</Text>
      <View style={styles.row}>
        <Link href="/maps" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/clouds/100/apple-map.png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>Carte</Text>
          </View>
        </Link>

        <Link href="/activity" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=t36Q7mOFSruf&format=png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>ACTIVITe</Text>
          </View>
        </Link>
      </View>

      <View style={styles.row}>
        <Link href="/weather" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=bILLAxIx8ASv&format=png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>METEO</Text>
          </View>
        </Link>

        <Link href="/compass" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=_KezNZzTITx3&format=png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>BOUSSOLE</Text>
          </View>
        </Link>
      </View>

      <View style={styles.row}>
        <Link href="/contact" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=110240&format=png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>URGENCE</Text>
          </View>
        </Link>

        <Link href="/picture" style={styles.CTA}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=110583&format=png' }}
              style={styles.image}
            />
            <Text style={fontsLoaded ? styles.caption : null}>PHOTOS</Text>
          </View>
        </Link>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  CTA: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 175,
    height: 175,
  },
  caption: {
    fontSize: 25,
    color: 'black',
    marginTop: 5,
    fontFamily: 'YamFont',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: 'NatureFont',
    color: '#333',
  },
  title: {
    fontSize: 50,
    fontFamily: 'SpaceFont',
    fontWeight: '700',
  }
});
