import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index"   options={{ title: 'Tableau de bord' }} />
      <Tabs.Screen name="explore" options={{ title: 'Journal' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Rappels' }} />
    </Tabs>
  );
}