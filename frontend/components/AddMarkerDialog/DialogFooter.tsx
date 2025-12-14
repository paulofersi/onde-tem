import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { TouchableOpacity } from 'react-native';

interface DialogFooterProps {
  canSave: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function DialogFooter({ canSave, saving, onCancel, onSave }: DialogFooterProps) {
  return (
    <Box className="flex-row justify-between mt-5 gap-3 pt-5 border-t-2 border-gray-200 dark:border-gray-700">
      <TouchableOpacity
        className="flex-1 py-4 rounded-xl items-center justify-center bg-gray-100 dark:bg-gray-700 active:opacity-70"
        onPress={onCancel}
        disabled={saving}
        activeOpacity={0.7}>
        <ThemedText className="font-semibold text-base text-gray-700 dark:text-gray-300">
          Cancelar
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-4 rounded-xl items-center justify-center ${
          canSave 
            ? 'bg-blue-600 dark:bg-blue-500 active:opacity-90' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
        onPress={onSave}
        disabled={!canSave}
        activeOpacity={0.9}>
        <ThemedText className={`font-semibold text-base ${
          canSave ? 'text-white' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {saving ? 'Salvando...' : 'Salvar'}
        </ThemedText>
      </TouchableOpacity>
    </Box>
  );
}

