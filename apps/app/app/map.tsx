import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Country = {
  name: string;
  start: number;
  end: number;
  unlockedThrough: number; // last level the user has reached
};

const COUNTRIES: Country[] = [
  { name: 'France', start: 1, end: 12, unlockedThrough: 2 },
  { name: 'Argentina', start: 13, end: 80, unlockedThrough: 0 },
  { name: 'Sweden', start: 81, end: 160, unlockedThrough: 0 },
  { name: 'United States', start: 161, end: 240, unlockedThrough: 0 },
  { name: 'Italy', start: 241, end: 320, unlockedThrough: 0 },
  { name: 'Japan', start: 321, end: 400, unlockedThrough: 0 },
  { name: 'Germany', start: 401, end: 480, unlockedThrough: 0 },
  { name: 'Brazil', start: 481, end: 560, unlockedThrough: 0 },
  { name: 'Spain', start: 561, end: 640, unlockedThrough: 0 },
  { name: 'Canada', start: 641, end: 720, unlockedThrough: 0 },
  { name: 'Australia', start: 721, end: 800, unlockedThrough: 0 },
  { name: 'India', start: 801, end: 880, unlockedThrough: 0 },
  { name: 'Egypt', start: 881, end: 960, unlockedThrough: 0 },
  { name: 'Mexico', start: 961, end: 1040, unlockedThrough: 0 },
  { name: 'Greece', start: 1041, end: 1120, unlockedThrough: 0 },
  { name: 'Netherlands', start: 1121, end: 1200, unlockedThrough: 0 },
  { name: 'Thailand', start: 1201, end: 1280, unlockedThrough: 0 },
  { name: 'Turkey', start: 1281, end: 1360, unlockedThrough: 0 },
  { name: 'Norway', start: 1361, end: 1440, unlockedThrough: 0 },
  { name: 'Portugal', start: 1441, end: 1520, unlockedThrough: 0 },
];

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require('@/assets/images/bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.dim} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={styles.logoTab}>
            <Text style={styles.logoTabTile}>TILE</Text>
            <Text style={styles.logoTabExplorer}>Explorer</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {COUNTRIES.map((c) => (
            <CountrySection key={c.name} country={c} onPlay={(lvl) => router.push('/game')} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function CountrySection({
  country,
  onPlay,
}: {
  country: Country;
  onPlay: (level: number) => void;
}) {
  const levels: number[] = [];
  for (let i = country.start; i <= Math.min(country.start + 4, country.end); i++) levels.push(i);

  return (
    <View style={styles.section}>
      <View style={styles.panel}>
        <Image
          source={require('@/assets/images/bg.png')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.panelTint} />
        <View style={styles.panelHeader}>
          <Text style={styles.countryName}>{country.name}</Text>
          <Text style={styles.countryRange}>
            Level {country.start}-{country.end}
          </Text>
        </View>
        <View style={styles.row}>
          {levels.map((lvl) => {
            const unlocked = lvl <= country.unlockedThrough;
            return (
              <Pressable
                key={lvl}
                disabled={!unlocked}
                onPress={() => onPlay(lvl)}
                style={[styles.card, unlocked && styles.cardUnlocked]}>
                <View style={[styles.cardInner, unlocked && styles.cardInnerUnlocked]}>
                  {unlocked ? (
                    <Text style={styles.cardLabel}>Lv {lvl}</Text>
                  ) : (
                    <Ionicons name="lock-closed" size={20} color="#7a8aa3" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#3268a8' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(35,80,150,0.55)' },
  safe: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logoTab: {
    backgroundColor: '#5db4e0',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
  },
  logoTabTile: {
    color: '#ffd84d',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#a35a1d',
    textShadowOffset: { width: 0, height: 1 },
  },
  logoTabExplorer: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: -2,
  },

  scroll: { padding: 12, paddingBottom: 32 },

  section: { marginBottom: 14 },
  panelHeader: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  countryName: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  countryRange: {
    color: '#f5c542',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
  },

  panel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  panelTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40,70,120,0.45)',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 8,
    justifyContent: 'center',
  },
  card: {
    width: '17%',
    aspectRatio: 0.9,
    borderRadius: 14,
    padding: 3,
    backgroundColor: 'rgba(60,80,110,0.45)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardUnlocked: {
    backgroundColor: '#5a45a8',
    borderColor: '#fff',
  },
  cardInner: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,140,180,0.5)',
  },
  cardInnerUnlocked: {
    backgroundColor: '#9a8acc',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  cardLabel: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
  },
});
