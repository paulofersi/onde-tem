import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/context/ThemeContext';
import { ActivityIndicator } from 'react-native';

export function LoadingScreen() {
  const { theme } = useTheme();

  return (
    <ThemedView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
      <ActivityIndicator size="large" color={theme === 'dark' ? '#6ee7b7' : '#047857'} />
      <ThemedText className="mt-4 text-gray-600 dark:text-gray-400">
        Carregando...
      </ThemedText>
    </ThemedView>
  );
}

