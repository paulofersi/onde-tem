import { ThemedText } from '@/components/ThemedText';
import { Card, CardBody } from '@/components/ui/card';
import { Supermarket } from '@/types/supermarket';

interface SupermarketHeaderProps {
  supermarket: Supermarket | null;
  name: string;
  address: string;
  description: string;
  isTablet: boolean;
}

export function SupermarketHeader({
  name,
  address,
  description,
  isTablet,
}: SupermarketHeaderProps) {
  return (
    <Card variant="elevated" size={isTablet ? 'lg' : 'md'} className="mx-4">
      <CardBody>
        <ThemedText type="title" className={`${isTablet ? 'text-3xl mb-3' : 'text-2xl mb-2'}`}>
          {name}
        </ThemedText>
        {address && (
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-2`}>
            📍 {address}
          </ThemedText>
        )}
        {description && (
          <ThemedText className={`${isTablet ? 'text-base leading-6' : 'text-sm leading-5'} text-gray-500 dark:text-gray-500`}>
            {description}
          </ThemedText>
        )}
      </CardBody>
    </Card>
  );
}

