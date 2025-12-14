import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Card, CardBody } from '@/components/ui/card';

interface CoordinatesCardProps {
  latitude: number;
  longitude: number;
  isTablet: boolean;
}

export function CoordinatesCard({ latitude, longitude, isTablet }: CoordinatesCardProps) {
  return (
    <Card variant="elevated" size={isTablet ? 'lg' : 'md'} className={`mx-4 mb-4 ${isTablet ? 'mx-6' : ''}`}>
      <CardBody className={`${isTablet ? 'flex-row flex-wrap justify-between' : ''}`}>
        <Box className={`flex-row justify-between items-center py-2 ${isTablet ? 'w-[48%] py-3' : ''} border-b border-gray-100 dark:border-gray-700`}>
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}>
            Latitude:
          </ThemedText>
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} text-gray-900 dark:text-gray-100 font-mono`}>
            {latitude.toFixed(6)}
          </ThemedText>
        </Box>
        <Box className={`flex-row justify-between items-center py-2 ${isTablet ? 'w-[48%] py-3' : ''} border-b border-gray-100 dark:border-gray-700`}>
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}>
            Longitude:
          </ThemedText>
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} text-gray-900 dark:text-gray-100 font-mono`}>
            {longitude.toFixed(6)}
          </ThemedText>
        </Box>
      </CardBody>
    </Card>
  );
}

