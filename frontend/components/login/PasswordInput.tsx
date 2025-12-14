import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { getPasswordHelperText } from './utils';

interface PasswordInputProps {
  password: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error: string;
  isLogin: boolean;
  editable?: boolean;
}

export function PasswordInput({
  password,
  onChangeText,
  onBlur,
  error,
  isLogin,
  editable = true,
}: PasswordInputProps) {
  const { theme } = useTheme();

  return (
    <Box className="mb-5">
      <ThemedText className="text-sm font-semibold mb-2">Senha</ThemedText>
      <Input
        value={password}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={
          isLogin
            ? 'Digite sua senha'
            : 'Mínimo 8 caracteres com pelo menos 1 letra'
        }
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        editable={editable}
        className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${error ? 'border-2 border-red-500' : ''}`}
      />
      {error ? (
        <ThemedText className="text-xs mt-1 text-red-500">{error}</ThemedText>
      ) : null}
      {!isLogin && !error && password.length > 0 && (
        <ThemedText className="text-xs mt-1" style={{ color: Colors[theme].success }}>
          {getPasswordHelperText(password)}
        </ThemedText>
      )}
    </Box>
  );
}

