import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMatchTicket, getMatches, StadiumMatch } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { colors, typography } from '../theme';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import AppState from '../components/AppState';

export default function StadiumScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const [matches, setMatches] = useState<StadiumMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<StadiumMatch | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMatches();
      setMatches(response.matches);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los partidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMatches(); }, [loadMatches]);

  const chooseMatch = (match: StadiumMatch) => {
    setSelectedMatch(match);
    setSelectedSectorId(match.stadium.sectors[0]?.id ?? '');
    setSeatNumber('');
  };

  const buyTicket = async () => {
    if (!token || !selectedMatch || !selectedSectorId || !seatNumber.trim()) {
      Alert.alert('Datos incompletos', 'Selecciona un sector e indica tu localidad.');
      return;
    }
    setBuying(true);
    try {
      const response = await createMatchTicket(token, selectedMatch.id, selectedSectorId, seatNumber);
      navigation.navigate('Ticket', {
        ticketId: response.ticket.id,
        qrPayload: response.ticket.qrPayload,
        status: response.ticket.status,
        movieTitle: `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`,
        selectedSeats: [response.ticket.seatNumber],
        startTime: selectedMatch.startTime,
        roomName: `${selectedMatch.stadium.name} · ${response.ticket.sector}`,
      });
      setSelectedMatch(null);
    } catch (buyError) {
      Alert.alert('No se pudo generar el ticket', buyError instanceof Error ? buyError.message : 'Inténtalo nuevamente.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={matches}
        keyExtractor={(match) => match.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<>
          <Text style={styles.overline}>Deporte en vivo</Text>
          <Text style={styles.title}>Partidos</Text>
          <Text style={styles.subtitle}>Elige tu partido y recibe una entrada QR para el estadio.</Text>
          {selectedMatch && <AppCard style={styles.purchaseCard}>
            <Text style={styles.sectionTitle}>Comprar entrada</Text>
            <Text style={styles.matchTitle}>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</Text>
            <Text style={styles.meta}>{selectedMatch.stadium.name} · {selectedMatch.stadium.city}</Text>
            <Text style={styles.label}>Sector</Text>
            <View style={styles.options}>
              {selectedMatch.stadium.sectors.map((sector) => <Pressable key={sector.id} accessibilityRole="button" accessibilityState={{ selected: selectedSectorId === sector.id }} style={[styles.option, selectedSectorId === sector.id && styles.optionSelected]} onPress={() => setSelectedSectorId(sector.id)}><Text style={styles.optionText}>{sector.name} · €{Number(sector.price).toFixed(2)}</Text></Pressable>)}
            </View>
            <AppInput label="Localidad" value={seatNumber} onChangeText={setSeatNumber} placeholder="Ej. A1" autoCapitalize="characters" />
            <AppButton label="Generar ticket QR" onPress={() => void buyTicket()} disabled={buying} loading={buying} />
            <AppButton label="Cancelar" variant="secondary" onPress={() => setSelectedMatch(null)} disabled={buying} />
          </AppCard>}
        </>}
        ListEmptyComponent={loading ? <AppState loading title="Cargando partidos..." /> : <AppState title="No hay partidos disponibles" message={error || 'Vuelve a consultar más tarde.'} />}
        renderItem={({ item }) => <AppCard style={styles.matchCard}>
          <Text style={styles.status}>{item.status === 'LIVE' ? 'EN VIVO' : 'PRÓXIMO PARTIDO'}</Text>
          <Text style={styles.matchTitle}>{item.homeTeam} vs {item.awayTeam}</Text>
          <Text style={styles.meta}>{new Date(item.startTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
          <Text style={styles.meta}>{item.stadium.name} · {item.stadium.city} · {item.stadium.capacity} localidades</Text>
          <AppButton label="Comprar entrada" onPress={() => chooseMatch(item)} />
        </AppCard>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 12 },
  overline: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', fontFamily: typography.display },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  matchCard: { gap: 8 },
  purchaseCard: { gap: 10, marginBottom: 8 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  matchTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  meta: { color: colors.textSecondary, fontSize: 13 },
  status: { color: colors.success, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  label: { color: colors.text, fontSize: 12, fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 10 },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { color: colors.text, fontSize: 12, fontWeight: '700' },
});
