import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Supermarket } from '@/types/supermarket';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';

interface SupermarketSelectProps {
  supermarkets: Supermarket[];
  selectedSupermarketId: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function SupermarketSelect({
  supermarkets,
  selectedSupermarketId,
  onValueChange,
  disabled,
}: SupermarketSelectProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectedSupermarket = supermarkets.find((s) => s.id === selectedSupermarketId);

  if (supermarkets.length === 0) {
    return (
      <Box className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <ThemedText className="text-base text-amber-800 dark:text-amber-200">
          ⚠️ Cadastre um supermercado primeiro para adicionar produtos.
        </ThemedText>
      </Box>
    );
  }

  const handleSelect = (supermarketId: string) => {
    onValueChange(supermarketId);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors[theme].border,
          backgroundColor: Colors[theme].background,
          opacity: disabled ? 0.5 : 1,
        }}>
        <ThemedText
          className="text-base flex-1"
          style={{
            color: selectedSupermarket ? Colors[theme].text : Colors[theme].textSecondary,
          }}>
          {selectedSupermarket?.name || 'Selecione um supermercado'}
        </ThemedText>
        <IconSymbol name="chevron.down" size={18} color={Colors[theme].textSecondary} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setIsOpen(false)}>
          <ThemedView
            style={{
              backgroundColor: Colors[theme].background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 20,
              maxHeight: '80%',
            }}
            onStartShouldSetResponder={() => true}>
            <Box className="w-full py-3 items-center">
              <Box
                className="w-16 h-1 rounded-full"
                style={{ backgroundColor: Colors[theme].border }}
              />
            </Box>

            <ScrollView
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}>
              {supermarkets.map((supermarket) => (
                <TouchableOpacity
                  key={supermarket.id}
                  onPress={() => handleSelect(supermarket.id)}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors[theme].border,
                  }}>
                  <ThemedText className="text-base">
                    {supermarket.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

