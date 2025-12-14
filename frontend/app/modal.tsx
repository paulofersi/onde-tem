import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ModalScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <ThemedText type="title">Modal</ThemedText>
      <Link href="/" dismissTo className="mt-4 py-4">
        <ThemedText type="link">Ir para a tela inicial</ThemedText>
      </Link>
    </ThemedView>
  );
}
