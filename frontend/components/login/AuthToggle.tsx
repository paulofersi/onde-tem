import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function AuthToggle({ isLogin, onToggle, disabled = false }: AuthToggleProps) {
  return (
    <Box className="flex-row justify-center items-center mt-6">
      <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
        {isLogin
          ? 'Não tem uma conta? '
          : 'Já tem uma conta? '}
      </ThemedText>
      <Button
        variant="ghost"
        onPress={onToggle}
        disabled={disabled}
        className="p-0">
        <ThemedText className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {isLogin ? 'Registrar' : 'Fazer Login'}
        </ThemedText>
      </Button>
    </Box>
  );
}

