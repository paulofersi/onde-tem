import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  email: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error: string;
  editable?: boolean;
}

export function EmailInput({
  email,
  onChangeText,
  onBlur,
  error,
  editable = true,
}: EmailInputProps) {
  return (
    <Box className="mb-5">
      <ThemedText className="text-sm font-semibold mb-2">Email</ThemedText>
      <Input
        value={email}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={editable}
        className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${error ? 'border-2 border-red-500' : ''}`}
      />
      {error ? (
        <ThemedText className="text-xs mt-1 text-red-500">{error}</ThemedText>
      ) : null}
    </Box>
  );
}

