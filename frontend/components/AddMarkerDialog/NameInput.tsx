import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { RefObject } from 'react';
import { TextInput } from 'react-native';

interface NameInputProps {
  name: string;
  onChangeText: (text: string) => void;
  inputRef: RefObject<TextInput | null>;
  editable?: boolean;
  onSubmitEditing: () => void;
}

export function NameInput({
  name,
  onChangeText,
  inputRef,
  editable = true,
  onSubmitEditing,
}: NameInputProps) {
  return (
    <Box className="mb-5">
      <ThemedText className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Nome da localização *
      </ThemedText>
      <TextInput
        ref={inputRef}
        className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3.5 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={name}
        onChangeText={onChangeText}
        placeholder="Ex: Casa, Trabalho, Academia..."
        placeholderTextColor="#999"
        maxLength={50}
        editable={editable}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
      />
      {name.length > 0 && (
        <ThemedText className="text-xs mt-1.5 text-gray-500 dark:text-gray-400">
          {name.trim().length}/50 caracteres
        </ThemedText>
      )}
    </Box>
  );
}

