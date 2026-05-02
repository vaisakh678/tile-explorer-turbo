import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const ROWS = 10;
const COLS = 8;
const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
type Cell = number | null;

function makeBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.floor(Math.random() * COLORS.length)),
  );
}

function findGroup(board: Cell[][], r: number, c: number): [number, number][] {
  const target = board[r][c];
  if (target === null) return [];
  const seen = new Set<string>();
  const stack: [number, number][] = [[r, c]];
  const group: [number, number][] = [];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const key = `${cr},${cc}`;
    if (seen.has(key)) continue;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
    if (board[cr][cc] !== target) continue;
    seen.add(key);
    group.push([cr, cc]);
    stack.push([cr + 1, cc], [cr - 1, cc], [cr, cc + 1], [cr, cc - 1]);
  }
  return group;
}

function collapse(board: Cell[][]): Cell[][] {
  const cols: Cell[][] = [];
  for (let c = 0; c < COLS; c++) {
    const stack: Cell[] = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] !== null) stack.push(board[r][c]);
    }
    while (stack.length < ROWS) stack.push(null);
    cols.push(stack);
  }
  const filled = cols.filter((col) => col.some((v) => v !== null));
  while (filled.length < COLS) filled.push(Array(ROWS).fill(null));
  const next: Cell[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      next[ROWS - 1 - r][c] = filled[c][r];
    }
  }
  return next;
}

function hasMoves(board: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v === null) continue;
      if (r + 1 < ROWS && board[r + 1][c] === v) return true;
      if (c + 1 < COLS && board[r][c + 1] === v) return true;
    }
  }
  return false;
}

export default function GameScreen() {
  const [board, setBoard] = useState<Cell[][]>(() => makeBoard());
  const [score, setScore] = useState(0);

  const { width } = useWindowDimensions();
  const tileSize = Math.floor(Math.min(width - 32, 480) / COLS);
  const gameOver = useMemo(() => !hasMoves(board), [board]);

  const onTile = useCallback(
    (r: number, c: number) => {
      const group = findGroup(board, r, c);
      if (group.length < 2) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const next = board.map((row) => row.slice());
      for (const [gr, gc] of group) next[gr][gc] = null;
      setBoard(collapse(next));
      setScore((s) => s + group.length * (group.length - 1));
    },
    [board],
  );

  const reset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBoard(makeBoard());
    setScore(0);
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: 'Level 2' }} />
      <View style={styles.header}>
        <ThemedText type="title">Tile Pop</ThemedText>
        <ThemedText type="subtitle">Score: {score}</ThemedText>
      </View>

      <View style={[styles.board, { width: tileSize * COLS, height: tileSize * ROWS }]}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Pressable
              key={`${r}-${c}`}
              onPress={() => onTile(r, c)}
              style={[
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  left: c * tileSize,
                  top: r * tileSize,
                  backgroundColor: cell === null ? 'transparent' : COLORS[cell],
                },
              ]}
            />
          )),
        )}
      </View>

      <Pressable onPress={reset} style={styles.button}>
        <ThemedText type="defaultSemiBold">{gameOver ? 'Game Over — New Game' : 'New Game'}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', paddingTop: 64, gap: 16 },
  header: { alignItems: 'center', gap: 4 },
  board: {
    position: 'relative',
    backgroundColor: '#00000010',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00000020',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#00000015',
  },
});
