import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { useTheme } from '@/context/ThemeContext';
import { parsePrice } from './utils';

interface DiscountBoxProps {
  discountPercentage: number;
  originalPrice: string;
  discountPrice: string;
}

export function DiscountBox({ discountPercentage, originalPrice, discountPrice }: DiscountBoxProps) {
  const { theme } = useTheme();
  const savings = parsePrice(originalPrice) - parsePrice(discountPrice);

  return (
    <Box
      className={`p-4 rounded-lg mt-2 border-l-4 ${
        theme === 'dark'
          ? 'bg-emerald-900/30 border-emerald-500'
          : 'bg-emerald-50 border-emerald-500'
      }`}>
      <ThemedText
        className="text-base font-semibold"
        style={{ color: theme === 'dark' ? '#6ee7b7' : '#047857' }}>
        💰 Desconto: {discountPercentage}%
      </ThemedText>
      <ThemedText
        className="text-sm mt-1"
        style={{ color: theme === 'dark' ? '#6ee7b7' : '#047857' }}>
        Economia de R$ {savings.toFixed(2)}
      </ThemedText>
    </Box>
  );
}

