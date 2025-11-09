import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import ColorPicker, { HueSlider, Panel1, Preview, Swatches } from 'reanimated-color-picker';

interface AddMarkerDialogProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

export const AddMarkerDialog: React.FC<AddMarkerDialogProps> = ({
  visible,
  latitude,
  longitude,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF0000');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da localização');
      return;
    }

    onSave(name.trim(), color);
    setName('');
    setColor('#FF0000');
    onClose();
  };

  const updateColor = useCallback((hex: string) => {
    setColor(hex);
  }, []);

  const onSelectColor = useCallback(({ hex }: { hex: string }) => {
    'worklet';
    runOnJS(updateColor)(hex);
  }, [updateColor]);

  const handleCancel = () => {
    setName('');
    setColor('#FF0000');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.title}>
              Nova localização
            </ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Nome da localização</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor }]}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Latitude</ThemedText>
              <TextInput
                style={[styles.input, styles.disabledInput, { color: textColor }]}
                value={latitude.toFixed(6)}
                editable={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Longitude</ThemedText>
              <TextInput
                style={[styles.input, styles.disabledInput, { color: textColor }]}
                value={longitude.toFixed(6)}
                editable={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>
                Cor do marcador
              </ThemedText>
              <View style={styles.colorPickerContainer}>
                <ColorPicker
                  value={color}
                  onChange={onSelectColor}
                  style={styles.colorPicker}>
                  <Preview style={styles.preview} />
                  <Panel1 style={styles.panel} />
                  <HueSlider style={styles.slider} />
                  <Swatches
                    style={styles.swatches}
                    swatchStyle={styles.swatch}
                    colors={[
                      '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
                      '#0000FF', '#4B0082', '#9400D3', '#FF1493',
                    ]}
                  />
                </ColorPicker>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#000',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  colorPickerContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  colorPicker: {
    width: '100%',
  },
  preview: {
    height: 40,
    borderRadius: 8,
    marginBottom: 12,
  },
  panel: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 35,
    borderRadius: 8,
    marginBottom: 12,
  },
  swatches: {
    width: '100%',
    borderRadius: 8,
  },
  swatch: {
    borderRadius: 8,
  },
});

