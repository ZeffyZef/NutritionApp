import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ── Types ────────────────────────────────────────────────────
type Repas = {
  id: number;
  nom: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
};

// ── Repas rapides prédéfinis ─────────────────────────────────
const REPAS_RAPIDES = [
  { nom: 'Blanc de poulet 150g', calories: 165, proteines: 31, glucides: 0, lipides: 4 },
  { nom: 'Riz cuit 100g',        calories: 130, proteines: 3,  glucides: 28, lipides: 0 },
  { nom: 'Oeuf entier',          calories: 78,  proteines: 6,  glucides: 0,  lipides: 5 },
  { nom: 'Skyr 200g',            calories: 120, proteines: 20, glucides: 8,  lipides: 0 },
  { nom: 'Amandes 30g',          calories: 174, proteines: 6,  glucides: 5,  lipides: 15 },
  { nom: 'Patate douce 150g',    calories: 129, proteines: 2,  glucides: 30, lipides: 0 },
  { nom: 'Saumon 150g',          calories: 280, proteines: 36, glucides: 0,  lipides: 14 },
  { nom: 'Whey 30g',             calories: 120, proteines: 24, glucides: 3,  lipides: 2 },
];

export default function JournalScreen() {
  const [repasJournal, setRepasJournal] = useState<Repas[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Champs du formulaire manuel
  const [nom, setNom]           = useState('');
  const [calories, setCalories] = useState('');
  const [proteines, setProteines] = useState('');
  const [glucides, setGlucides] = useState('');
  const [lipides, setLipides]   = useState('');

  // ── Ajouter un repas rapide ──────────────────────────────
  const ajouterRepasRapide = (repas: typeof REPAS_RAPIDES[0]) => {
    const nouveau: Repas = { ...repas, id: Date.now() };
    setRepasJournal([...repasJournal, nouveau]);
  };

  // ── Ajouter un repas manuel ──────────────────────────────
  const ajouterRepasManuel = () => {
    if (!nom || !calories) return;
    const nouveau: Repas = {
      id: Date.now(),
      nom,
      calories: Number(calories),
      proteines: Number(proteines) || 0,
      glucides: Number(glucides) || 0,
      lipides: Number(lipides) || 0,
    };
    setRepasJournal([...repasJournal, nouveau]);
    setModalVisible(false);
    setNom(''); setCalories(''); setProteines(''); setGlucides(''); setLipides('');
  };

  // ── Supprimer un repas ───────────────────────────────────
  const supprimerRepas = (id: number) => {
    setRepasJournal(repasJournal.filter(r => r.id !== id));
  };

  // ── Totaux ───────────────────────────────────────────────
  const totaux = repasJournal.reduce((acc, r) => ({
    calories:  acc.calories  + r.calories,
    proteines: acc.proteines + r.proteines,
    glucides:  acc.glucides  + r.glucides,
    lipides:   acc.lipides   + r.lipides,
  }), { calories: 0, proteines: 0, glucides: 0, lipides: 0 });

  return (
    <ScrollView style={styles.container}>

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📓 Journal alimentaire</Text>
      </View>

      {/* Totaux du jour */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total consommé aujourd'hui</Text>
        <View style={styles.totauxRow}>
          <View style={styles.totauxItem}>
            <Text style={styles.totauxVal}>{totaux.calories}</Text>
            <Text style={styles.totauxLabel}>kcal</Text>
          </View>
          <View style={styles.totauxItem}>
            <Text style={[styles.totauxVal, { color: '#e74c3c' }]}>{totaux.proteines}g</Text>
            <Text style={styles.totauxLabel}>Protéines</Text>
          </View>
          <View style={styles.totauxItem}>
            <Text style={[styles.totauxVal, { color: '#f39c12' }]}>{totaux.glucides}g</Text>
            <Text style={styles.totauxLabel}>Glucides</Text>
          </View>
          <View style={styles.totauxItem}>
            <Text style={[styles.totauxVal, { color: '#3498db' }]}>{totaux.lipides}g</Text>
            <Text style={styles.totauxLabel}>Lipides</Text>
          </View>
        </View>
      </View>

      {/* Repas rapides */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Ajout rapide</Text>
        {REPAS_RAPIDES.map((repas, index) => (
          <TouchableOpacity
            key={index}
            style={styles.repasRapideRow}
            onPress={() => ajouterRepasRapide(repas)}
          >
            <View style={styles.repasRapideInfo}>
              <Text style={styles.repasRapideNom}>{repas.nom}</Text>
              <Text style={styles.repasRapideMacros}>
                P:{repas.proteines}g  G:{repas.glucides}g  L:{repas.lipides}g
              </Text>
            </View>
            <View style={styles.repasRapideKcal}>
              <Text style={styles.repasRapideKcalText}>{repas.calories}</Text>
              <Text style={styles.repasRapideKcalSub}>kcal</Text>
            </View>
            <Text style={styles.plusBtn}>＋</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton ajout manuel */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>＋ Ajouter un aliment manuellement</Text>
      </TouchableOpacity>

      {/* Journal du jour */}
      {repasJournal.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍽 Repas enregistrés</Text>
          {repasJournal.map(repas => (
            <View key={repas.id} style={styles.journalRow}>
              <View style={styles.journalInfo}>
                <Text style={styles.journalNom}>{repas.nom}</Text>
                <Text style={styles.journalMacros}>
                  {repas.calories} kcal  •  P:{repas.proteines}g  G:{repas.glucides}g  L:{repas.lipides}g
                </Text>
              </View>
              <TouchableOpacity onPress={() => supprimerRepas(repas.id)}>
                <Text style={styles.deleteBtn}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Modal saisie manuelle */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ajouter un aliment</Text>

            <TextInput style={styles.input} placeholder="Nom de l'aliment"
              value={nom} onChangeText={setNom} />
            <TextInput style={styles.input} placeholder="Calories (kcal)"
              keyboardType="numeric" value={calories} onChangeText={setCalories} />
            <TextInput style={styles.input} placeholder="Protéines (g)"
              keyboardType="numeric" value={proteines} onChangeText={setProteines} />
            <TextInput style={styles.input} placeholder="Glucides (g)"
              keyboardType="numeric" value={glucides} onChangeText={setGlucides} />
            <TextInput style={styles.input} placeholder="Lipides (g)"
              keyboardType="numeric" value={lipides} onChangeText={setLipides} />

            <TouchableOpacity style={styles.modalAddBtn} onPress={ajouterRepasManuel}>
              <Text style={styles.modalAddBtnText}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f4f6f7' },
  header:             { backgroundColor: '#1a2e4a', padding: 24, paddingTop: 60 },
  headerTitle:        { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  card:               { backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12,
                        padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle:          { fontSize: 14, color: '#7f8c8d', fontWeight: '600', marginBottom: 12,
                        textTransform: 'uppercase', letterSpacing: 0.5 },
  totauxRow:          { flexDirection: 'row', justifyContent: 'space-around' },
  totauxItem:         { alignItems: 'center' },
  totauxVal:          { fontSize: 22, fontWeight: 'bold', color: '#1a2e4a' },
  totauxLabel:        { fontSize: 11, color: '#95a5a6', marginTop: 2 },
  repasRapideRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
                        borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  repasRapideInfo:    { flex: 1 },
  repasRapideNom:     { fontWeight: '600', color: '#2c3e50', fontSize: 14 },
  repasRapideMacros:  { color: '#95a5a6', fontSize: 12, marginTop: 2 },
  repasRapideKcal:    { alignItems: 'center', marginRight: 12 },
  repasRapideKcalText:{ fontWeight: 'bold', color: '#1a2e4a', fontSize: 16 },
  repasRapideKcalSub: { fontSize: 10, color: '#95a5a6' },
  plusBtn:            { fontSize: 22, color: '#27ae60', fontWeight: 'bold' },
  addBtn:             { margin: 16, backgroundColor: '#1a2e4a', borderRadius: 12,
                        padding: 16, alignItems: 'center' },
  addBtnText:         { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  journalRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
                        borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  journalInfo:        { flex: 1 },
  journalNom:         { fontWeight: '600', color: '#2c3e50', fontSize: 14 },
  journalMacros:      { color: '#95a5a6', fontSize: 12, marginTop: 2 },
  deleteBtn:          { fontSize: 18, paddingLeft: 8 },
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard:          { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
                        padding: 24, paddingBottom: 40 },
  modalTitle:         { fontSize: 18, fontWeight: 'bold', color: '#1a2e4a', marginBottom: 16 },
  input:              { borderWidth: 1, borderColor: '#dce3ea', borderRadius: 8, padding: 12,
                        marginBottom: 10, fontSize: 14 },
  modalAddBtn:        { backgroundColor: '#27ae60', borderRadius: 10, padding: 14,
                        alignItems: 'center', marginTop: 4 },
  modalAddBtnText:    { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalCancelBtn:     { padding: 14, alignItems: 'center' },
  modalCancelBtnText: { color: '#95a5a6', fontSize: 14 },
});