import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ToggleKey = 'music' | 'sound' | 'effects' | 'vibration' | 'notifications';
type ToggleDef = { key: ToggleKey; icon: keyof typeof Ionicons.glyphMap };

const TOGGLES: ToggleDef[] = [
  { key: 'music', icon: 'musical-notes' },
  { key: 'sound', icon: 'volume-high' },
  { key: 'effects', icon: 'pulse' },
  { key: 'vibration', icon: 'phone-portrait' },
  { key: 'notifications', icon: 'notifications' },
];

export function SettingsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Record<ToggleKey, boolean>>({
    music: true,
    sound: true,
    effects: true,
    vibration: true,
    notifications: true,
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Header tab */}
          <View style={styles.headerWrap}>
            <View style={styles.headerTab}>
              <Text style={styles.headerText}>Settings</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>

          {/* Toggles */}
          <View style={styles.togglesRow}>
            {TOGGLES.map((t) => {
              const on = enabled[t.key];
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setEnabled((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
                  style={[styles.toggle, !on && styles.toggleOff]}>
                  <Ionicons name={t.icon} size={22} color="#fff" />
                  {!on ? <View style={styles.toggleSlash} /> : null}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Join us */}
          <View style={styles.joinRow}>
            <Text style={styles.joinText}>Join Us!</Text>
            <View style={styles.socialRow}>
              <View style={[styles.social, { backgroundColor: '#1877f2' }]}>
                <Ionicons name="logo-facebook" size={22} color="#fff" />
              </View>
              <View style={[styles.social, { backgroundColor: '#3b82f6' }]}>
                <Ionicons name="people" size={22} color="#fff" />
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Buttons */}
          <PillButton label="Language" color="#f3a73a" shadow="#c47a14" />
          <PillButton label="Support" color="#3fa9e8" shadow="#1d7eba" />

          <View style={styles.divider} />

          {/* Footer links */}
          <View style={styles.footerRow}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </View>
          <Text style={styles.version}>Version 1.0.0</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PillButton({ label, color, shadow }: { label: string; color: string; shadow: string }) {
  return (
    <Pressable style={[styles.pill, { backgroundColor: shadow }]}>
      <View style={[styles.pillInner, { backgroundColor: color }]}>
        <Text style={styles.pillText}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fbf3df',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 16,
    borderWidth: 3,
    borderColor: '#e5d9b8',
  },

  headerWrap: {
    position: 'absolute',
    top: -22,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTab: {
    backgroundColor: '#5db4e0',
    paddingHorizontal: 36,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e84545',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  toggle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5fbf57',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  toggleOff: { backgroundColor: '#a8a8a8' },
  toggleSlash: {
    position: 'absolute',
    width: 50,
    height: 3,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },

  divider: {
    height: 1,
    backgroundColor: '#e5d9b8',
    marginVertical: 14,
  },

  joinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  joinText: { fontSize: 18, fontWeight: '800', color: '#6b6047' },
  socialRow: { flexDirection: 'row', gap: 10 },
  social: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  pill: {
    borderRadius: 24,
    padding: 3,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  pillInner: {
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  pillText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  footerLink: {
    color: '#3a3a3a',
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  version: {
    textAlign: 'center',
    marginTop: 8,
    color: '#8a8270',
    fontSize: 12,
  },
});
