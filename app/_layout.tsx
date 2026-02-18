import { NutritionProvider } from '@/context/NutritionContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <NutritionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NutritionProvider>
  );
}