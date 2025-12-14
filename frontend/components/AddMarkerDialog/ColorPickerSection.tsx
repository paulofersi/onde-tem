import { ThemedText } from '@/components/ThemedText';
import { Box } from '@/components/ui/box';
import { useCallback } from 'react';
import ColorPicker, { HueSlider, Panel1, Preview, Swatches } from 'reanimated-color-picker';
import { PRESET_COLORS } from './constants';

interface ColorPickerSectionProps {
  color: string;
  onColorChange: (hex: string) => void;
}

export function ColorPickerSection({ color, onColorChange }: ColorPickerSectionProps) {
  const onSelectColor = useCallback(({ hex }: { hex: string }) => {
    onColorChange(hex);
  }, [onColorChange]);

  return (
    <Box className="mb-4">
      <ThemedText className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Cor do marcador
      </ThemedText>
      
      <Box className="items-center w-full">
        <ColorPicker
          value={color}
          onChange={onSelectColor}>
          <Preview 
            style={{ 
              height: 50, 
              borderRadius: 12, 
              marginBottom: 16,
              borderWidth: 2,
              borderColor: '#e5e7eb',
            }} 
          />
          <Panel1 
            style={{ 
              width: '100%', 
              height: 160, 
              borderRadius: 12, 
              marginBottom: 16 
            }} 
          />
          <HueSlider 
            style={{ 
              width: '100%', 
              height: 40, 
              borderRadius: 12, 
              marginBottom: 16 
            }} 
          />
          <Swatches
            style={{ 
              width: '100%', 
              borderRadius: 12,
              paddingVertical: 8,
            }}
            swatchStyle={{ 
              borderRadius: 10,
              marginHorizontal: 4,
              marginVertical: 4,
            }}
            colors={PRESET_COLORS}
          />
        </ColorPicker>
      </Box>
    </Box>
  );
}

