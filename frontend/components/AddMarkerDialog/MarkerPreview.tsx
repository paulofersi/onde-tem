import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';

interface MarkerPreviewProps {
  name: string;
  color: string;
}

export function MarkerPreview({ name, color }: MarkerPreviewProps) {
  return (
    <Box className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
      <ThemedText className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-center">
        Preview
      </ThemedText>
      <Box className="items-center justify-center py-2">
        <Box 
          style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: color,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }} 
        />
        {name.trim() && (
          <ThemedText className="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">
            {name.trim()}
          </ThemedText>
        )}
      </Box>
    </Box>
  );
}

