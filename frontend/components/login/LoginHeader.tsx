import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';

interface LoginHeaderProps {
  isLogin: boolean;
}

export function LoginHeader({ isLogin }: LoginHeaderProps) {
  return (
    <Box className="items-center mb-10">
      <ThemedText type="title" className="mb-2 text-center">
        {isLogin ? 'Bem-vindo' : 'Criar Conta'}
      </ThemedText>
      <ThemedText className="text-base text-center text-gray-600 dark:text-gray-400">
        {isLogin
          ? 'Entre para continuar'
          : 'Crie sua conta para começar'}
      </ThemedText>
    </Box>
  );
}

