import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { useAuth } from '../auth/AuthContext';

export default function ProfileAvatar() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const initials = (user?.email?.split('@')[0] ?? 'OM').slice(0, 2).toUpperCase();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
      <Text style={styles.text}>{initials}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.text, fontSize: 12, fontWeight: '800' },
});
