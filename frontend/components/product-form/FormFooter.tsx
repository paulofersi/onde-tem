import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

interface FormFooterProps {
  isSaving: boolean;
  canSave: boolean;
  isEdit: boolean;
  onSave: () => void;
}

export function FormFooter({ isSaving, canSave, isEdit, onSave }: FormFooterProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Box
      className="flex-row justify-between p-5 pt-4 gap-4"
      style={{
        backgroundColor: Colors[theme].background,
        borderTopWidth: 1,
        borderTopColor: Colors[theme].border,
        ...(theme === 'light' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        }),
        ...(theme === 'dark' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }),
      }}>
      <Button
        variant="outline"
        size="md"
        onPress={() => router.back()}
        disabled={isSaving}
        className="flex-1 bg-transparent py-3.5 active:opacity-80"
        style={{
          borderWidth: 1.5,
          borderColor: Colors[theme].border,
          backgroundColor: 'transparent',
        }}>
        <ThemedText
          className="font-semibold text-base"
          style={{ color: Colors[theme].text }}>
          Cancelar
        </ThemedText>
      </Button>

      <Button
        variant="solid"
        size="md"
        onPress={onSave}
        disabled={!canSave}
        className="flex-1 py-3.5 active:opacity-90"
        style={{
          backgroundColor: !canSave
            ? Colors[theme].disabledBackground
            : Colors[theme].success,
          opacity: !canSave ? 0.6 : 1,
        }}>
        {isSaving ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <ThemedText className="text-white font-semibold text-base">
            {isEdit ? 'Atualizar' : 'Salvar'}
          </ThemedText>
        )}
      </Button>
    </Box>
  );
}

