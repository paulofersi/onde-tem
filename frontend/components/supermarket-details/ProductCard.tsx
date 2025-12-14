import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Card, CardBody } from '@/components/ui/card';
import { DiscountItem } from '@/types/supermarket';
import { formatPrice } from './utils';

interface ProductCardProps {
  item: DiscountItem;
  isTablet: boolean;
}

export function ProductCard({ item, isTablet }: ProductCardProps) {
  return (
    <Card 
      variant="filled"
      size="md"
      className="mb-3 border-l-4 border-l-green-500 dark:border-l-green-600">
      <CardBody>
        <Box className="flex-row justify-between items-start mb-3">
          <ThemedText className={`${isTablet ? 'text-lg' : 'text-base'} font-semibold flex-1 mr-2`}>
            {item.name}
          </ThemedText>
          <Box className="rounded-lg px-2.5 py-1 min-w-[60px] items-center bg-green-500 dark:bg-green-600">
            <ThemedText className={`${isTablet ? 'text-sm' : 'text-xs'} font-bold text-white`}>
              -{item.discountPercentage}%
            </ThemedText>
          </Box>
        </Box>
        <Box className="flex-row items-center">
          <ThemedText className={`${isTablet ? 'text-base' : 'text-sm'} line-through text-gray-600 dark:text-gray-400`}>
            {formatPrice(item.originalPrice)}
          </ThemedText>
          <Box className="w-3" />
          <ThemedText className={`${isTablet ? 'text-2xl' : 'text-xl'} font-bold text-green-500 dark:text-green-400`}>
            {formatPrice(item.discountPrice)}
          </ThemedText>
        </Box>
      </CardBody>
    </Card>
  );
}

