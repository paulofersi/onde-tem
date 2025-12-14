import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Input } from '@/components/ui/input';

interface NameInputProps {
  name: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}

export function NameInput({ name, onChangeText, editable = true }: NameInputProps) {
  return (
    <Box className="mb-5">
      <ThemedText className="text-sm font-semibold mb-2">Nome</ThemedText>
      <Input
        value={name}
        onChangeText={onChangeText}
        placeholder="Digite seu nome"
        autoCapitalize="words"
        editable={editable}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
    </Box>
  );
}

