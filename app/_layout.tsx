import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="shopping" options={{ presentation: 'modal', title: 'Shopping List' }} />
       {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />*/}
        <Stack.Screen name="ItemForms" options={{ presentation: 'containedModal', title: 'Form item ' }} />
        <Stack.Screen name="createShopping" options={{ presentation: 'modal', title: 'add items' }} />
        
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}
