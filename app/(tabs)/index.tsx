import { useNutrition } from '@/context/NutritionContext';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function MacroBar({ label, current, target, color }: {
  label: string;
  current: number;
  target: number;
  color: string;
}) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValues}>{current}g / {target}g</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { isGymDay, setIsGymDay, totaux, targets } = useNutrition();

  const caloriesPercent = Math.min((totaux.calories / targets.calories) * 100, 100);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🥗 NutritionApp</Text>
        <View style={[styles.dayBadge, { backgroundColor: isGymDay ? '#27ae60' : '#2980b9' }]}>
          <Text style={styles.dayBadgeText}>{isGymDay ? '🏋️ Jour Gym' : '😴 Jour Repos'}</Text>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchBtn, isGymDay && styles.switchBtnActive]}
          onPress={() => setIsGymDay(true)}
        >
          <Text style={[styles.switchBtnText, isGymDay && styles.switchBtnTextActive]}>🏋️ Jour Gym</Text>
          <Text style={[styles.switchBtnSub, isGymDay && styles.switchBtnTextActive]}>2 880 kcal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchBtn, !isGymDay && styles.switchBtnActive]}
          onPress={() => setIsGymDay(false)}
        >
          <Text style={[styles.switchBtnText, !isGymDay && styles.switchBtnTextActive]}>😴 Jour Repos</Text>
          <Text style={[styles.switchBtnSub, !isGymDay && styles.switchBtnTextActive]}>2 540 kcal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calories du jour</Text>
        <Text style={styles.caloriesBig}>{totaux.calories}</Text>
        <Text style={styles.caloriesTarget}>sur {targets.calories} kcal</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, {
            width: `${caloriesPercent}%`,
            backgroundColor: caloriesPercent > 90 ? '#e74c3c' : '#27ae60'
          }]} />
        </View>
        <Text style={styles.caloriesRemaining}>
          ✅ Restant : {targets.calories - totaux.calories} kcal
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutriments</Text>
        <MacroBar label="Protéines" current={totaux.proteines} target={targets.proteines} color="#e74c3c" />
        <MacroBar label="Glucides"  current={totaux.glucides}  target={targets.glucides}  color="#f39c12" />
        <MacroBar label="Lipides"   current={totaux.lipides}   target={targets.lipides}   color="#3498db" />
      </View>

      <View style={[styles.card, styles.nextMealCard]}>
        <Text style={styles.cardTitle}>🔔 Prochain repas</Text>
        <Text style={styles.nextMealTime}>13h00 — Déjeuner</Text>
        <Text style={styles.nextMealTarget}>Cible : P: 52g  G: 40g  L: 12g  (~476 kcal)</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#f4f6f7' },
  header:               { backgroundColor: '#1a2e4a', padding: 24, paddingTop: 60,
                          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle:          { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  dayBadge:             { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dayBadgeText:         { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  switchContainer:      { flexDirection: 'row', margin: 16, backgroundColor: '#fff',
                          borderRadius: 12, padding: 6, shadowColor: '#000',
                          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  switchBtn:            { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  switchBtnActive:      { backgroundColor: '#1a2e4a' },
  switchBtnText:        { fontWeight: '600', fontSize: 14, color: '#7f8c8d' },
  switchBtnSub:         { fontSize: 11, color: '#95a5a6', marginTop: 2 },
  switchBtnTextActive:  { color: '#fff' },
  card:                 { backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12,
                          padding: 20, shadowColor: '#000', shadowOpacity: 0.06,
                          shadowRadius: 8, elevation: 3 },
  cardTitle:            { fontSize: 14, color: '#7f8c8d', fontWeight: '600', marginBottom: 12,
                          textTransform: 'uppercase', letterSpacing: 0.5 },
  caloriesBig:          { fontSize: 52, fontWeight: 'bold', color: '#1a2e4a', textAlign: 'center' },
  caloriesTarget:       { textAlign: 'center', color: '#95a5a6', marginBottom: 12, fontSize: 14 },
  caloriesRemaining:    { textAlign: 'center', color: '#27ae60', fontWeight: '600', marginTop: 8 },
  macroRow:             { marginBottom: 14 },
  macroHeader:          { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel:           { fontWeight: '600', color: '#2c3e50', fontSize: 14 },
  macroValues:          { color: '#7f8c8d', fontSize: 13 },
  barBackground:        { height: 10, backgroundColor: '#ecf0f1', borderRadius: 5, overflow: 'hidden' },
  barFill:              { height: 10, borderRadius: 5 },
  nextMealCard:         { backgroundColor: '#eaf6fb', borderLeftWidth: 4,
                          borderLeftColor: '#16a085', marginBottom: 32 },
  nextMealTime:         { fontSize: 18, fontWeight: 'bold', color: '#1a2e4a', marginBottom: 4 },
  nextMealTarget:       { color: '#555', fontSize: 13 },
});