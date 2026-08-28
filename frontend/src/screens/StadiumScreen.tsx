import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  const getSectorSeats = (sectorId: string): string[] => {
    const sector = selectedMatch?.stadium.sectors.find((s) => s.id === sectorId);
    if (!sector || !sector.seatLayout) return [];
    const layout = typeof sector.seatLayout === 'string' ? JSON.parse(sector.seatLayout) : sector.seatLayout;
    return layout.rows?.flatMap((row: any) => row.seats) ?? [];
  };

  const availableSeats = getSectorSeats(selectedSectorId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedMatch ? (
        <ScrollView contentContainerStyle={styles.containerScroll}>
          <Pressable onPress={() => setSelectedMatch(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Volver</Text>
          </Pressable>
          <AppCard style={styles.purchaseCard}>
            <Text style={styles.sectionTitle}>Resumen de compra</Text>
            <View style={styles.matchHeader}>
              <Text style={styles.matchTitle}>{selectedMatch.homeTeam}</Text>
              <Text style={styles.vs}>VS</Text>
              <Text style={styles.matchTitle}>{selectedMatch.awayTeam}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Estadio:</Text>
              <Text style={styles.infoValue}>{selectedMatch.stadium.name}</Text>
              <Text style={styles.infoLabel}>Ciudad:</Text>
              <Text style={styles.infoValue}>{selectedMatch.stadium.city}</Text>
              <Text style={styles.infoLabel}>Fecha y hora:</Text>
              <Text style={styles.infoValue}>{new Date(selectedMatch.startTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
            </View>

            <Text style={styles.label}>Selecciona tu sector</Text>
            <View style={styles.options}>
              {selectedMatch.stadium.sectors.map((sector) => (
                <Pressable
                  key={sector.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedSectorId === sector.id }}
                  style={[styles.option, selectedSectorId === sector.id && styles.optionSelected]}
                  onPress={() => setSelectedSectorId(sector.id)}
                >
                  <Text style={[styles.optionText, selectedSectorId === sector.id && styles.optionTextSelected]}>
                    {sector.name}
                  </Text>
                  <Text style={[styles.optionPrice, selectedSectorId === sector.id && styles.optionTextSelected]}>
                    €{Number(sector.price).toFixed(2)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Elige tu localidad</Text>
            {availableSeats.length > 0 ? (
              <View style={styles.seatsGrid}>
                {availableSeats.map((seat, idx) => (
                  <Pressable
                    key={idx}
                    accessibilityRole="button"
                    accessibilityState={{ selected: seatNumber === seat }}
                    style={[styles.seat, seatNumber === seat && styles.seatSelected]}
                    onPress={() => setSeatNumber(seat)}
                  >
                    <Text style={[styles.seatText, seatNumber === seat && styles.seatTextSelected]}>{seat}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.noSeats}>
                <Text style={styles.noSeatsText}>Ingresa tu localidad manualmente</Text>
                <AppInput label="Localidad" value={seatNumber} onChangeText={setSeatNumber} placeholder="Ej. A1" autoCapitalize="characters" />
              </View>
            )}

            {seatNumber && (
              <View style={styles.summary}>
                <Text style={styles.summaryText}>Localidad seleccionada: <Text style={styles.summaryBold}>{seatNumber}</Text></Text>
                <Text style={styles.summaryText}>Sector: <Text style={styles.summaryBold}>{selectedMatch.stadium.sectors.find((s) => s.id === selectedSectorId)?.name}</Text></Text>
                <Text style={styles.summaryText}>Precio: <Text style={styles.summaryBold}>€{Number(selectedMatch.stadium.sectors.find((s) => s.id === selectedSectorId)?.price).toFixed(2)}</Text></Text>
              </View>
            )}

            <AppButton label="Generar ticket QR" onPress={() => void buyTicket()} disabled={buying || !seatNumber} loading={buying} />
            <AppButton label="Cancelar" variant="secondary" onPress={() => setSelectedMatch(null)} disabled={buying} />
          </AppCard>
        </ScrollView>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(match) => match.id}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <>
              <Text style={styles.overline}>Deporte en vivo</Text>
              <Text style={styles.title}>Partidos</Text>
              <Text style={styles.subtitle}>Elige tu partido y recibe una entrada QR para el estadio.</Text>
            </>
          }
          ListEmptyComponent={
            loading ? (
              <AppState loading title="Cargando partidos..." />
            ) : error ? (
              <View style={styles.errorContainer}>
                <AppState title="No se pudieron cargar los partidos" message={error} />
                <AppButton label="Reintentar" onPress={() => void loadMatches()} />
              </View>
            ) : (
              <AppState title="No hay partidos disponibles" message="Vuelve a consultar más tarde." />
            )
          }
          renderItem={({ item }) => (
            <AppCard style={styles.matchCard}>
              <Text style={[styles.status, item.status === 'LIVE' && styles.statusLive]}>
                {item.status === 'LIVE' ? '🔴 EN VIVO' : '⏰ PRÓXIMO'}
              </Text>
              <View style={styles.matchRow}>
                <View style={styles.matchTeam}>
                  <Text style={styles.teamName}>{item.homeTeam}</Text>
                </View>
                <Text style={styles.vs}>VS</Text>
                <View style={styles.matchTeam}>
                  <Text style={styles.teamName}>{item.awayTeam}</Text>
                </View>
              </View>
              <Text style={styles.meta}>{new Date(item.startTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
              <Text style={styles.meta}>📍 {item.stadium.name}, {item.stadium.city}</Text>
              <Text style={styles.meta}>👥 {item.stadium.capacity} localidades disponibles</Text>
              <AppButton label="Comprar entrada" onPress={() => chooseMatch(item)} />
            </AppCard>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 12 },
  containerScroll: { padding: 16, gap: 12 },
  overline: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', fontFamily: typography.display },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  matchCard: { gap: 12 },
  purchaseCard: { gap: 16, marginBottom: 8 },
  backButton: { padding: 10, marginBottom: 8 },
  backText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  matchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 12 },
  matchTitle: { color: colors.text, fontSize: 18, fontWeight: '800', flex: 1, textAlign: 'center' },
  vs: { color: colors.textSecondary, fontSize: 14, fontWeight: '800' },
  info: { backgroundColor: colors.border + '20', borderRadius: 8, padding: 12, gap: 6 },
  infoLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  meta: { color: colors.textSecondary, fontSize: 13 },
  status: { color: colors.success, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  statusLive: { color: colors.critical },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { borderColor: colors.border, borderWidth: 1.5, borderRadius: 8, padding: 12, flex: 1, minWidth: '45%' },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  optionTextSelected: { color: colors.background },
  optionPrice: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
  seatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  seat: { width: '15%', aspectRatio: 1, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  seatSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  seatText: { color: colors.text, fontSize: 10, fontWeight: '700' },
  seatTextSelected: { color: colors.background },
  noSeats: { gap: 8 },
  noSeatsText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
  summary: { backgroundColor: colors.primary + '15', borderRadius: 8, padding: 12, gap: 4 },
  summaryText: { color: colors.text, fontSize: 13 },
  summaryBold: { fontWeight: '800', color: colors.primary },
  matchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginVertical: 8 },
  matchTeam: { flex: 1 },
  teamName: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  errorContainer: { gap: 12 },
});
