import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Layered scenic background */}
      <View style={[styles.layer, styles.sky]} />
      <View style={[styles.layer, styles.skyMid]} />
      <View style={[styles.layer, styles.skyHaze]} />

      {/* Distant mountains */}
      <View style={[styles.mountain, styles.mountainBackLeft]} />
      <View style={[styles.mountain, styles.mountainBackRight]} />
      {/* Foreground snow-capped peaks */}
      <View style={[styles.mountain, styles.mountainFrontLeft]}>
        <View style={styles.snowCap} />
      </View>
      <View style={[styles.mountain, styles.mountainFrontRight]}>
        <View style={styles.snowCap} />
      </View>

      {/* Lavender field */}
      <View style={styles.field} />
      <View style={styles.fieldFront} />

      {/* Tiny house */}
      <View style={styles.house}>
        <View style={styles.houseRoof} />
        <View style={styles.houseBody} />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <CircleButton>
              <Ionicons name="settings-sharp" size={20} color="#fff" />
            </CircleButton>
            <CircleButton>
              <Ionicons name="cube" size={20} color="#fff" />
            </CircleButton>
          </View>
          <View style={styles.topRight}>
            <View style={styles.coinPill}>
              <View style={styles.coin}>
                <Text style={styles.coinGlyph}>$</Text>
              </View>
              <Text style={styles.coinText}>350</Text>
              <View style={styles.coinPlus}>
                <Ionicons name="add" size={14} color="#fff" />
              </View>
            </View>
            <CircleButton>
              <Ionicons name="cart" size={20} color="#fff" />
            </CircleButton>
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoLeaf} />
          <Text style={styles.logoTile}>TILE</Text>
          <Text style={styles.logoExplorer}>Explorer</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom controls */}
        <View style={styles.bottom}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>
          <Pressable
            onPress={() => router.push('/game')}
            style={({ pressed }) => [styles.levelBtn, pressed && { transform: [{ scale: 0.97 }] }]}>
            <View style={styles.levelBtnInner}>
              <Text style={styles.levelText}>Level 2</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function CircleButton({ children }: { children: React.ReactNode }) {
  return <View style={styles.circleBtn}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#a8d4ee',
    overflow: 'hidden',
  },
  layer: { position: 'absolute', left: 0, right: 0 },
  sky: { top: 0, height: '55%', backgroundColor: '#9ed1ee' },
  skyMid: { top: '25%', height: '20%', backgroundColor: '#bfe1f1' },
  skyHaze: { top: '40%', height: '15%', backgroundColor: '#d6e9ee' },

  mountain: {
    position: 'absolute',
    width: 320,
    height: 320,
    transform: [{ rotate: '45deg' }],
  },
  mountainBackLeft: {
    backgroundColor: '#6f8aa3',
    top: '32%',
    left: -180,
  },
  mountainBackRight: {
    backgroundColor: '#7d97ad',
    top: '30%',
    right: -160,
  },
  mountainFrontLeft: {
    backgroundColor: '#5a7795',
    top: '38%',
    left: -100,
    width: 280,
    height: 280,
    alignItems: 'center',
  },
  mountainFrontRight: {
    backgroundColor: '#506e8c',
    top: '36%',
    right: -90,
    width: 300,
    height: 300,
    alignItems: 'center',
  },
  snowCap: {
    position: 'absolute',
    top: 10,
    width: 90,
    height: 90,
    backgroundColor: '#f4f8fb',
    transform: [{ rotate: '0deg' }],
    borderRadius: 6,
  },

  field: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '38%',
    backgroundColor: '#9b7fc4',
  },
  fieldFront: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '22%',
    backgroundColor: '#7c5fae',
  },

  house: {
    position: 'absolute',
    right: 36,
    bottom: '38%',
    width: 36,
    alignItems: 'center',
  },
  houseRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#c45a3e',
  },
  houseBody: {
    width: 28,
    height: 22,
    backgroundColor: '#f4ead8',
  },

  safe: { flex: 1, paddingHorizontal: 16 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  topLeft: { flexDirection: 'row', gap: 8 },
  topRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },

  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingLeft: 4,
    paddingRight: 4,
    height: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    gap: 6,
  },
  coin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5c542',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinGlyph: { color: '#a07717', fontWeight: '900', fontSize: 14 },
  coinText: { color: '#fff', fontWeight: '800', fontSize: 14, minWidth: 30 },
  coinPlus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3fb44b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoWrap: {
    alignItems: 'center',
    marginTop: 18,
  },
  logoLeaf: {
    position: 'absolute',
    top: -8,
    left: 28,
    width: 28,
    height: 18,
    backgroundColor: '#5fbf57',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    transform: [{ rotate: '-15deg' }],
  },
  logoTile: {
    fontSize: 84,
    fontWeight: '900',
    color: '#ffd84d',
    letterSpacing: 2,
    textShadowColor: '#a35a1d',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
  },
  logoExplorer: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    marginTop: -6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },

  bottom: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7aa9c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  levelBtn: {
    width: '85%',
    backgroundColor: '#2a8a3a',
    borderRadius: 22,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  levelBtnInner: {
    backgroundColor: '#42b94d',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  levelText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
});
