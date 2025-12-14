import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { Card, CardBody } from '@/components/ui/card';
import { DiscountItem } from '@/types/supermarket';
import { ProductCard } from './ProductCard';

interface ProductsListProps {
  discountItems: DiscountItem[];
  isTablet: boolean;
}

export function ProductsList({ discountItems, isTablet }: ProductsListProps) {
  return (
    <Card variant="elevated" size="md" className={`mx-4 ${isTablet ? 'mx-6' : ''}`}>
      <CardBody>
        <ThemedText type="subtitle" className={`${isTablet ? 'text-2xl mb-3' : 'text-lg mb-2'}`}>
          Produtos com Desconto
        </ThemedText>
        {discountItems.length > 0 ? (
          <Box className="mt-3">
            {discountItems.map((item: DiscountItem) => (
              <ProductCard key={item.id} item={item} isTablet={isTablet} />
            ))}
          </Box>
        ) : (
          <ThemedText className={`${isTablet ? 'text-base leading-6' : 'text-sm leading-5'} text-gray-600 dark:text-gray-400`}>
            Nenhum produto com desconto disponível no momento.
          </ThemedText>
        )}
      </CardBody>
    </Card>
  );
}

