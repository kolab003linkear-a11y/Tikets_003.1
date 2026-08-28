import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAdminStadium, getAdminStadiums, AdminStadium, AdminStadiumInput } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { colors, typography } from '../theme';

const defaultSector = () => ({ name: '', code: '', capacity: 100, price: 20, seatLayout: { rows: ['A', 'B', 'C', 'D', 'E'], columns: 20 } });
const emptyDraft: AdminStadiumInput = { name: '', city: '', capacity: 100, imageUrl: '', seatLayout: { rows: ['A', 'B', 'C', 'D', 'E'], columns: 20 }, sectors: [defaultSector()] };

export default function AdminStadiumsScreen() {
  const { user, token } = useAuth();
  const [stadiums, setStadiums] = useState<AdminStadium[]>([]);
  const [draft, setDraft] = useState<AdminStadiumInput>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const totalCapacity = useMemo(() => stadiums.reduce((sum, stadium) => sum + stadium.capacity, 0), [stadiums]);

  const loadStadiums = async () => {
    if (!token) return;
    setLoading(true);
    try { setStadiums((await getAdminStadiums(token)).stadiums); setError(''); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los estadios.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.role === 'ADMIN') void loadStadiums(); }, [token, user?.role]);

  if (!user || user.role !== 'ADMIN') return <SafeAreaView style={styles.safeArea}><View style={styles.centered}><Text style={styles.title}>Acceso restringido</Text></View></SafeAreaView>;

  const updateSector = (index: number, field: string, value: string) => setDraft((current) => ({ ...current, sectors: current.sectors.map((sector, sectorIndex) => sectorIndex === index ? { ...sector, [field]: field === 'name' || field === 'code' ? value : Number(value) || 0 } : sector) }));
  const save = async () => {
    if (!token || !draft.name.trim() || !draft.city.trim() || draft.capacity < 1 || draft.sectors.some((sector) => !sector.name.trim() || !sector.code.trim() || sector.capacity < 1 || sector.price <= 0)) { Alert.alert('Datos incompletos', 'Completa estadio, capacidad y todos los sectores.'); return; }
    setSaving(true);
    try { const response = await createAdminStadium(token, { ...draft, imageUrl: draft.imageUrl?.trim() || null }); setStadiums((current) => [response.stadium, ...current]); setDraft({ ...emptyDraft, sectors: [defaultSector()] }); Alert.alert('Estadio creado', 'La sede ya está disponible para programar partidos.'); }
    catch (saveError) { Alert.alert('No se pudo crear el estadio', saveError instanceof Error ? saveError.message : 'Revisa que la capacidad coincida con los sectores.'); }
    finally { setSaving(false); }
  };

  return <SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.container}>
    <View style={styles.headerRow}><View><Text style={styles.overline}>Infraestructura</Text><Text style={styles.title}>Estadios</Text></View><View style={styles.headerIcon}><Ionicons name="football-outline" size={21} color={colors.text} /></View></View>
    <Text style={styles.subtitle}>Registra sedes, imágenes y sectores para vender entradas de partidos.</Text>
    <View style={styles.statsRow}><View style={styles.statItem}><Text style={styles.statValue}>{stadiums.length}</Text><Text style={styles.statLabel}>Sedes</Text></View><View style={styles.statDivider} /><View style={styles.statItem}><Text style={styles.statValue}>{totalCapacity.toLocaleString('es-ES')}</Text><Text style={styles.statLabel}>Aforo total</Text></View><View style={styles.statDivider} /><View style={styles.statItem}><Text style={[styles.statValue, styles.statSuccess]}>{stadiums.reduce((sum, stadium) => sum + stadium.sectors.length, 0)}</Text><Text style={styles.statLabel}>Sectores</Text></View></View>
    <View style={styles.form}><View style={styles.formHeader}><View><Text style={styles.sectionTitle}>Nueva sede</Text><Text style={styles.formHint}>La capacidad debe coincidir con filas, columnas y sectores.</Text></View><Ionicons name="add-circle-outline" size={23} color={colors.primary} /></View>
      <Field label="Nombre del estadio" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} placeholder="Ej. Estadio Banco Guayaquil" />
      <Field label="Ciudad" value={draft.city} onChangeText={(city) => setDraft({ ...draft, city })} placeholder="Ej. Quito" />
      <Field label="Capacidad total" value={String(draft.capacity)} keyboardType="numeric" onChangeText={(value) => setDraft({ ...draft, capacity: Number(value) || 0 })} />
      <Field label="URL de imagen" value={draft.imageUrl ?? ''} onChangeText={(imageUrl) => setDraft({ ...draft, imageUrl })} placeholder="https://..." autoCapitalize="none" />
      <Text style={styles.label}>Sectores</Text>
      {draft.sectors.map((sector, index) => <View style={styles.sectorBox} key={`${sector.code}-${index}`}><View style={styles.sectorHeader}><Text style={styles.sectorTitle}>Sector {index + 1}</Text>{draft.sectors.length > 1 && <Pressable onPress={() => setDraft({ ...draft, sectors: draft.sectors.filter((_, sectorIndex) => sectorIndex !== index) })}><Ionicons name="trash-outline" size={17} color={colors.critical} /></Pressable>}</View><Field label="Nombre" value={sector.name} onChangeText={(value) => updateSector(index, 'name', value)} placeholder="Ej. General Norte" /><Field label="Código" value={sector.code} onChangeText={(value) => updateSector(index, 'code', value.toUpperCase())} placeholder="GEN_N" autoCapitalize="characters" /><View style={styles.inline}><View style={styles.inlineField}><Field label="Capacidad" value={String(sector.capacity)} keyboardType="numeric" onChangeText={(value) => updateSector(index, 'capacity', value)} /></View><View style={styles.inlineField}><Field label="Precio" value={String(sector.price)} keyboardType="decimal-pad" onChangeText={(value) => updateSector(index, 'price', value)} /></View></View></View>)}
      <Pressable style={styles.addSector} onPress={() => setDraft({ ...draft, sectors: [...draft.sectors, defaultSector()] })}><Ionicons name="add" size={17} color={colors.primary} /><Text style={styles.addSectorText}>Añadir sector</Text></Pressable>
      <Pressable style={styles.primaryButton} onPress={() => void save()} disabled={saving}>{saving ? <ActivityIndicator color={colors.text} /> : <><Ionicons name="save-outline" size={18} color={colors.text} /><Text style={styles.buttonText}>Guardar estadio</Text></>}</Pressable>
    </View>
    <View style={styles.listHeader}><Text style={styles.sectionTitle}>Sedes registradas</Text><Pressable onPress={() => void loadStadiums()}><Ionicons name="refresh-outline" size={19} color={colors.primary} /></Pressable></View>
    {loading ? <ActivityIndicator color={colors.primary} /> : error ? <Text style={styles.error}>{error}</Text> : stadiums.map((stadium) => <View style={styles.stadiumRow} key={stadium.id}>{stadium.imageUrl ? <Image source={{ uri: stadium.imageUrl }} style={styles.stadiumImage} /> : <View style={styles.stadiumImageFallback}><Ionicons name="football-outline" size={22} color={colors.primary} /></View>}<View style={styles.stadiumInfo}><Text style={styles.stadiumName}>{stadium.name}</Text><Text style={styles.meta}>{stadium.city} · {stadium.capacity.toLocaleString('es-ES')} localidades</Text><Text style={styles.meta}>{stadium.sectors.length} sectores · {stadium._count?.matches ?? 0} partidos</Text></View></View>)}
  </ScrollView></SafeAreaView>;
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) { return <View><Text style={styles.label}>{label}</Text><TextInput {...props} style={styles.input} placeholderTextColor={colors.textSecondary} /></View>; }

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.background }, container: { padding: 16, gap: 12 }, centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }, headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, headerIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, overline: { color: colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.3 }, title: { color: colors.text, fontSize: 30, fontWeight: '800', fontFamily: typography.display }, subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 }, statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingVertical: 12 }, statItem: { flex: 1, alignItems: 'center', gap: 3 }, statValue: { color: colors.text, fontSize: 19, fontWeight: '800' }, statSuccess: { color: colors.success }, statLabel: { color: colors.textSecondary, fontSize: 10 }, statDivider: { width: 1, backgroundColor: colors.border }, form: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, gap: 9 }, formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' }, formHint: { color: colors.textSecondary, fontSize: 10, marginTop: 4 }, label: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 4 }, input: { minHeight: 44, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 10, color: colors.text, paddingHorizontal: 12 }, sectorBox: { backgroundColor: colors.surfaceRaised, borderRadius: 12, padding: 12, gap: 7 }, sectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectorTitle: { color: colors.primary, fontSize: 12, fontWeight: '800' }, inline: { flexDirection: 'row', gap: 8 }, inlineField: { flex: 1 }, addSector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8 }, addSectorText: { color: colors.primary, fontSize: 12, fontWeight: '800' }, primaryButton: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.primary, borderRadius: 10, marginTop: 4 }, buttonText: { color: colors.text, fontWeight: '800' }, listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }, stadiumRow: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surfaceRaised, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 10 }, stadiumImage: { width: 62, height: 62, borderRadius: 9 }, stadiumImageFallback: { width: 62, height: 62, borderRadius: 9, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' }, stadiumInfo: { flex: 1 }, stadiumName: { color: colors.text, fontSize: 15, fontWeight: '800' }, meta: { color: colors.textSecondary, fontSize: 11, marginTop: 4 }, error: { color: colors.critical, fontWeight: '700' } });