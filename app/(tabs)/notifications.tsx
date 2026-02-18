import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ── Configuration par défaut ─────────────────────────────────
const RAPPELS_DEFAUT = [
  { id: '1', nom: 'Petit-déjeuner', heure: 8,  minute: 0,  actif: true  },
  { id: '2', nom: 'Collation matin', heure: 11, minute: 0,  actif: true  },
  { id: '3', nom: 'Déjeuner',        heure: 13, minute: 0,  actif: true  },
  { id: '4', nom: 'Collation après-midi', heure: 16, minute: 0, actif: true },
  { id: '5', nom: 'Dîner',           heure: 19, minute: 30, actif: true  },
  { id: '6', nom: 'Collation soir',  heure: 21, minute: 30, actif: true  },
];

type Rappel = typeof RAPPELS_DEFAUT[0];

// ── Formatage heure ──────────────────────────────────────────
const formatHeure = (h: number, m: number) =>
  `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

// ── Composant éditeur d'heure ────────────────────────────────
function EditeurHeure({ rappel, onSave, onCancel }: {
  rappel: Rappel;
  onSave: (heure: number, minute: number) => void;
  onCancel: () => void;
}) {
  const [heure,  setHeure]  = useState(String(rappel.heure));
  const [minute, setMinute] = useState(String(rappel.minute).padStart(2, '0'));

  const valider = () => {
    const h = Math.min(23, Math.max(0, Number(heure)   || 0));
    const m = Math.min(59, Math.max(0, Number(minute)  || 0));
    onSave(h, m);
  };

  return (
    <View style={styles.editeurContainer}>
      <Text style={styles.editeurTitre}>Modifier l'horaire</Text>
      <Text style={styles.editeurNom}>{rappel.nom}</Text>
      <View style={styles.editeurRow}>
        <View style={styles.editeurChamp}>
          <Text style={styles.editeurLabel}>Heure (0-23)</Text>
          <TextInput
            style={styles.editeurInput}
            keyboardType="numeric"
            value={heure}
            onChangeText={setHeure}
            maxLength={2}
          />
        </View>
        <Text style={styles.editeurSeparateur}>:</Text>
        <View style={styles.editeurChamp}>
          <Text style={styles.editeurLabel}>Minutes (0-59)</Text>
          <TextInput
            style={styles.editeurInput}
            keyboardType="numeric"
            value={minute}
            onChangeText={setMinute}
            maxLength={2}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.editeurSaveBtn} onPress={valider}>
        <Text style={styles.editeurSaveBtnText}>✓ Confirmer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editeurCancelBtn} onPress={onCancel}>
        <Text style={styles.editeurCancelBtnText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Écran principal ──────────────────────────────────────────
export default function NotificationsScreen() {
  const [rappels, setRappels]         = useState<Rappel[]>(RAPPELS_DEFAUT);
  const [permissionOk, setPermissionOk] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [statusMsg, setStatusMsg]     = useState('');

  // ── Demander la permission au chargement ─────────────────
  useEffect(() => {
    demanderPermission();
  }, []);

  const demanderPermission = async () => {
    if (!Device.isDevice) {
      setStatusMsg('Les notifications nécessitent un vrai appareil.');
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionOk(status === 'granted');
    if (status !== 'granted') {
      setStatusMsg('Permission refusée — active les notifications dans les réglages.');
    }
  };

  // ── Planifier toutes les notifications actives ────────────
  const planifierNotifications = async (liste: Rappel[]) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const rappel of liste) {
      if (!rappel.actif) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🍽 ${rappel.nom}`,
          body: 'Il est temps de manger et de noter tes macros !',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: rappel.heure,
          minute: rappel.minute,
        },
      });
    }

    const count = liste.filter(r => r.actif).length;
    setStatusMsg(`✅ ${count} notification(s) planifiée(s) avec succès !`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // ── Activer / désactiver un rappel ────────────────────────
  const toggleRappel = (id: string) => {
    setRappels(prev => prev.map(r =>
      r.id === id ? { ...r, actif: !r.actif } : r
    ));
  };

  // ── Sauvegarder un horaire modifié ────────────────────────
  const sauvegarderHoraire = (id: string, heure: number, minute: number) => {
    setRappels(prev => prev.map(r =>
      r.id === id ? { ...r, heure, minute } : r
    ));
    setEditingId(null);
  };

  const rappelEdite = rappels.find(r => r.id === editingId);

  const testerNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍽 Test — Déjeuner',
      body: 'Il est temps de manger et de noter tes macros !',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
  setStatusMsg('🔔 Notification de test dans 5 secondes !');
  setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Rappels de repas</Text>
      </View>

      {/* Statut permission */}
      <View style={[styles.permissionCard, { borderLeftColor: permissionOk ? '#27ae60' : '#e74c3c' }]}>
        <Text style={styles.permissionText}>
          {permissionOk
            ? '✅ Notifications autorisées'
            : '❌ Notifications non autorisées — appuie sur le bouton ci-dessous'}
        </Text>
        {!permissionOk && (
          <TouchableOpacity style={styles.permissionBtn} onPress={demanderPermission}>
            <Text style={styles.permissionBtnText}>Autoriser les notifications</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Message de statut */}
      {statusMsg !== '' && (
        <View style={styles.statusMsg}>
          <Text style={styles.statusMsgText}>{statusMsg}</Text>
        </View>
      )}

      {/* Éditeur d'heure (affiché si on édite) */}
      {editingId && rappelEdite && (
        <View style={styles.card}>
          <EditeurHeure
            rappel={rappelEdite}
            onSave={(h, m) => sauvegarderHoraire(editingId, h, m)}
            onCancel={() => setEditingId(null)}
          />
        </View>
      )}

      {/* Liste des rappels */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Horaires des repas</Text>
        {rappels.map(rappel => (
          <View key={rappel.id} style={styles.rappelRow}>
            <Switch
              value={rappel.actif}
              onValueChange={() => toggleRappel(rappel.id)}
              trackColor={{ false: '#dce3ea', true: '#27ae60' }}
              thumbColor={rappel.actif ? '#fff' : '#f0f0f0'}
            />
            <View style={styles.rappelInfo}>
              <Text style={[styles.rappelNom, !rappel.actif && styles.rappelInactif]}>
                {rappel.nom}
              </Text>
              <Text style={[styles.rappelHeure, !rappel.actif && styles.rappelInactif]}>
                {formatHeure(rappel.heure, rappel.minute)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditingId(rappel.id)}
            >
              <Text style={styles.editBtnText}>✏️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bouton planifier */}
      <TouchableOpacity style={styles.testBtn} onPress={testerNotification}>
      <Text style={styles.testBtnText}>🧪 Envoyer une notification test (5 sec)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.planifierBtn, !permissionOk && styles.planifierBtnDisabled]}
        onPress={() => planifierNotifications(rappels)}
        disabled={!permissionOk}
      >

        <Text style={styles.planifierBtnText}>🔔 Activer les rappels</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Les rappels se déclenchent chaque jour aux horaires configurés. Appuie sur ✏️ pour modifier un horaire, puis sur "Activer les rappels" pour appliquer les changements.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:              { flex: 1, backgroundColor: '#f4f6f7' },
  header:                 { backgroundColor: '#1a2e4a', padding: 24, paddingTop: 60 },
  headerTitle:            { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  permissionCard:         { margin: 16, marginBottom: 0, backgroundColor: '#fff', borderRadius: 12,
                            padding: 16, borderLeftWidth: 4 },
  permissionText:         { fontSize: 14, color: '#2c3e50' },
  permissionBtn:          { marginTop: 10, backgroundColor: '#e74c3c', borderRadius: 8,
                            padding: 10, alignItems: 'center' },
  permissionBtnText:      { color: '#fff', fontWeight: 'bold' },
  statusMsg:              { margin: 16, marginBottom: 0, backgroundColor: '#eaf6fb',
                            borderRadius: 10, padding: 12 },
  statusMsgText:          { color: '#16a085', fontWeight: '600', textAlign: 'center' },
  card:                   { backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12,
                            padding: 20, shadowColor: '#000', shadowOpacity: 0.06,
                            shadowRadius: 8, elevation: 3 },
  cardTitle:              { fontSize: 14, color: '#7f8c8d', fontWeight: '600', marginBottom: 12,
                            textTransform: 'uppercase', letterSpacing: 0.5 },
  rappelRow:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
                            borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rappelInfo:             { flex: 1, marginLeft: 12 },
  rappelNom:              { fontWeight: '600', color: '#2c3e50', fontSize: 14 },
  rappelHeure:            { color: '#27ae60', fontWeight: 'bold', fontSize: 16, marginTop: 2 },
  rappelInactif:          { color: '#bdc3c7' },
  editBtn:                { padding: 8 },
  editBtnText:            { fontSize: 18 },
  editeurContainer:       { },
  editeurTitre:           { fontSize: 16, fontWeight: 'bold', color: '#1a2e4a', marginBottom: 4 },
  editeurNom:             { color: '#7f8c8d', marginBottom: 16 },
  editeurRow:             { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  editeurChamp:           { flex: 1 },
  editeurLabel:           { fontSize: 12, color: '#7f8c8d', marginBottom: 6 },
  editeurInput:           { borderWidth: 1, borderColor: '#dce3ea', borderRadius: 8,
                            padding: 12, fontSize: 24, fontWeight: 'bold',
                            textAlign: 'center', color: '#1a2e4a' },
  editeurSeparateur:      { fontSize: 28, fontWeight: 'bold', color: '#1a2e4a',
                            marginHorizontal: 12, marginBottom: 8 },
  editeurSaveBtn:         { backgroundColor: '#27ae60', borderRadius: 10, padding: 12,
                            alignItems: 'center', marginBottom: 8 },
  editeurSaveBtnText:     { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  editeurCancelBtn:       { padding: 10, alignItems: 'center' },
  editeurCancelBtnText:   { color: '#95a5a6' },
  planifierBtn:           { margin: 16, backgroundColor: '#1a2e4a', borderRadius: 12,
                            padding: 16, alignItems: 'center' },
  planifierBtnDisabled:   { backgroundColor: '#bdc3c7' },
  planifierBtnText:       { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  note:                   { margin: 16, marginTop: 8, color: '#95a5a6', fontSize: 12,
                            textAlign: 'center', lineHeight: 18, marginBottom: 32 },
  testBtn:      { marginHorizontal: 16, marginTop: 16, backgroundColor: '#8e44ad',
                borderRadius: 12, padding: 16, alignItems: 'center' },
  testBtnText:  { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});