import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';

interface CoordinatesDisplayProps {
  latitude: number;
  longitude: number;
}

export function CoordinatesDisplay({ latitude, longitude }: CoordinatesDisplayProps) {
  return (
    <Box className="mb-5 bg-gray-50 dark:bg-gray-750 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <ThemedText className="text-xs font-semibold mb-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Coordenadas
      </ThemedText>
      
      <Box className="flex-row items-center mb-2">
        <ThemedText className="text-sm font-medium w-20 text-gray-700 dark:text-gray-300">
          Latitude:
        </ThemedText>
        <ThemedText className="text-sm font-mono text-gray-900 dark:text-gray-100">
          {latitude.toFixed(6)}
        </ThemedText>
      </Box>
      
      <Box className="flex-row items-center">
        <ThemedText className="text-sm font-medium w-20 text-gray-700 dark:text-gray-300">
          Longitude:
        </ThemedText>
        <ThemedText className="text-sm font-mono text-gray-900 dark:text-gray-100">
          {longitude.toFixed(6)}
        </ThemedText>
      </Box>
    </Box>
  );
}

