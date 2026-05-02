import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SLIDE_DURATION = 320;

const ICONS = [
  '🌳', '🍇', '🥦', '🍉', '🍋', '🍌',
  '🍒', '🍎', '🍓', '🥕', '🌽', '🍑',
  '🥝', '🍍', '🥥', '🍆', '🥑', '🍐',
];
const COLS = 6;
const ROWS = 9; // 54 tiles = 18 icons × 3
const TRAY_SIZE = 7;

type Tile = { id: number; icon: string };

function makeBoard(): Tile[] {
  const tiles: Tile[] = [];
  let id = 0;
  for (const icon of ICONS) {
    for (let i = 0; i < 3; i++) tiles.push({ id: id++, icon });
  }
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

export default function GameScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [board, setBoard] = useState<(Tile | null)[]>(() => makeBoard());
  const [tray, setTray] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);

  const remaining = useMemo(() => board.filter(Boolean).length, [board]);

  // Auto-resolve triples in tray.
  useEffect(() => {
    const counts = new Map<string, Tile[]>();
    for (const t of tray) {
      const list = counts.get(t.icon) ?? [];
      list.push(t);
      counts.set(t.icon, list);
    }
    for (const [, list] of counts) {
      if (list.length >= 3) {
        const ids = new Set(list.slice(0, 3).map((t) => t.id));
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTray((cur) => cur.filter((t) => !ids.has(t.id)));
          setScore((s) => s + 30);
        }, 250);
        return;
      }
    }
    if (tray.length >= TRAY_SIZE) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        Alert.alert('Tray full!', 'No room left for new tiles.', [
          { text: 'Restart', onPress: restart },
          { text: 'Quit', onPress: () => router.back(), style: 'cancel' },
        ]);
      }, 100);
    }
  }, [tray]); // eslint-disable-line react-hooks/exhaustive-deps

  // Win check.
  useEffect(() => {
    if (remaining === 0 && tray.length === 0) {
      setTimeout(() => {
        Alert.alert('Level Complete!', `Score: ${score}`, [
          { text: 'Play Again', onPress: restart },
          { text: 'Home', onPress: () => router.back(), style: 'cancel' },
        ]);
      }, 300);
    }
  }, [remaining, tray.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = useCallback(() => {
    setBoard(makeBoard());
    setTray([]);
    setScore(0);
  }, []);

  const onTile = useCallback(
    (idx: number) => {
      const tile = board[idx];
      if (!tile) return;
      if (tray.length >= TRAY_SIZE) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setBoard((cur) => {
        const next = cur.slice();
        next[idx] = null;
        return next;
      });
      setTray((cur) => [...cur, tile]);
    },
    [board, tray.length],
  );

  // Power-ups
  const undo = useCallback(() => {
    if (tray.length === 0) return;
    const last = tray[tray.length - 1];
    const slot = board.findIndex((t) => t === null);
    if (slot < 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTray((cur) => cur.slice(0, -1));
    setBoard((cur) => {
      const next = cur.slice();
      next[slot] = last;
      return next;
    });
  }, [tray, board]);

  const shuffle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setBoard((cur) => {
      const tiles = cur.filter(Boolean) as Tile[];
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      const next: (Tile | null)[] = Array(cur.length).fill(null);
      let k = 0;
      for (let i = 0; i < cur.length; i++) {
        if (cur[i] !== null) next[i] = tiles[k++];
      }
      return next;
    });
  }, []);

  const hint = useCallback(() => {
    // Send up to 3 of the most-frequent on-board icon to tray to clear a triple.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const counts = new Map<string, number[]>();
    board.forEach((t, i) => {
      if (!t) return;
      const arr = counts.get(t.icon) ?? [];
      arr.push(i);
      counts.set(t.icon, arr);
    });
    let pickIdxs: number[] | null = null;
    for (const [, idxs] of counts) {
      if (idxs.length >= 3 && tray.length + 3 <= TRAY_SIZE) {
        pickIdxs = idxs.slice(0, 3);
        break;
      }
    }
    if (!pickIdxs) return;
    setBoard((cur) => {
      const next = cur.slice();
      const taken: Tile[] = [];
      for (const i of pickIdxs!) {
        if (next[i]) taken.push(next[i]!);
        next[i] = null;
      }
      setTray((tcur) => [...tcur, ...taken]);
      return next;
    });
  }, [board, tray.length]);

  const boardWidth = Math.min(width - 24, 480);
  const tileSize = Math.floor(boardWidth / COLS) - 4;

  // Slide top clusters in from off-screen on mount.
  const leftX = useSharedValue(-220);
  const rightX = useSharedValue(220);
  useEffect(() => {
    leftX.value = withTiming(0, { duration: SLIDE_DURATION });
    rightX.value = withTiming(0, { duration: SLIDE_DURATION });
  }, [leftX, rightX]);
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: leftX.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: rightX.value }] }));

  const goBack = useCallback(() => {
    leftX.value = withTiming(-220, { duration: SLIDE_DURATION });
    rightX.value = withTiming(220, { duration: SLIDE_DURATION });
    setTimeout(() => router.back(), SLIDE_DURATION - 60);
  }, [router, leftX, rightX]);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <Image
        source={require('@/assets/images/bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Animated.View style={[styles.topGroup, leftStyle]}>
            <CircleButton onPress={goBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </CircleButton>
            <CircleButton onPress={restart}>
              <Ionicons name="refresh" size={20} color="#fff" />
            </CircleButton>
          </Animated.View>
          <Text style={styles.levelTitle}>Level 2</Text>
          <Animated.View style={[styles.topGroup, rightStyle]}>
            <View style={styles.coinPill}>
              <View style={styles.coin}>
                <Text style={styles.coinGlyph}>$</Text>
              </View>
              <Text style={styles.coinText}>{350 + score}</Text>
            </View>
            <CircleButton>
              <Ionicons name="cart" size={20} color="#fff" />
            </CircleButton>
          </Animated.View>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>Tiles left: {remaining}</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        {/* Board */}
        <View style={[styles.board, { width: boardWidth }]}>
          {board.map((tile, idx) => (
            <Pressable
              key={idx}
              onPress={() => onTile(idx)}
              style={[
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  opacity: tile ? 1 : 0,
                },
              ]}
              disabled={!tile}>
              {tile ? <Text style={{ fontSize: tileSize * 0.55 }}>{tile.icon}</Text> : null}
            </Pressable>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Tray */}
        <View style={styles.tray}>
          {Array.from({ length: TRAY_SIZE }).map((_, i) => {
            const t = tray[i];
            return (
              <View key={i} style={styles.traySlot}>
                {t ? <Text style={styles.trayIcon}>{t.icon}</Text> : null}
              </View>
            );
          })}
        </View>

        {/* Power-ups */}
        <View style={styles.powerRow}>
          <PowerButton icon="arrow-undo" onPress={undo} />
          <PowerButton icon="shuffle" onPress={shuffle} />
          <PowerButton icon="bulb" onPress={hint} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function CircleButton({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.circleBtn}>
      {children}
    </Pressable>
  );
}

function PowerButton({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.powerBtn}>
      <Ionicons name={icon} size={26} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#cfe6f4' },

  safe: { flex: 1, paddingHorizontal: 12 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  topGroup: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  levelTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },

  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    borderRadius: 18,
    paddingLeft: 4,
    paddingRight: 10,
    height: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    gap: 6,
  },
  coin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f5c542',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinGlyph: { color: '#a07717', fontWeight: '900', fontSize: 12 },
  coinText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  scoreText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  board: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
    gap: 4,
  },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  tray: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    padding: 6,
    gap: 4,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  traySlot: {
    width: 38,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trayIcon: { fontSize: 24 },

  powerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 14,
    marginBottom: 8,
  },
  powerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c5fae',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
