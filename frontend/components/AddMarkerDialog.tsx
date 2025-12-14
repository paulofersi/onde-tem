import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { ColorPickerSection } from './AddMarkerDialog/ColorPickerSection';
import { DEFAULT_COLOR } from './AddMarkerDialog/constants';
import { CoordinatesDisplay } from './AddMarkerDialog/CoordinatesDisplay';
import { DialogFooter } from './AddMarkerDialog/DialogFooter';
import { MarkerPreview } from './AddMarkerDialog/MarkerPreview';
import { NameInput } from './AddMarkerDialog/NameInput';
import { AddMarkerDialogProps } from './AddMarkerDialog/types';
import { validateMarkerName } from './AddMarkerDialog/utils';

export const AddMarkerDialog: React.FC<AddMarkerDialogProps> = ({
  visible,
  latitude,
  longitude,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [saving, setSaving] = useState(false);
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setName('');
      setColor(DEFAULT_COLOR);
      setSaving(false);
      
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleColorChange = useCallback((hex: string) => {
    setColor(hex);
  }, []);

  const handleSave = useCallback(async () => {
    const validation = validateMarkerName(name);
    
    if (!validation.valid) {
      Alert.alert('Erro', validation.error);
      return;
    }

    try {
      setSaving(true);
      dismissKeyboard();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onSave(name.trim(), color);
      
      setName('');
      setColor(DEFAULT_COLOR);
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a localização');
      console.error('Error saving marker:', error);
    } finally {
      setSaving(false);
    }
  }, [name, color, onSave, onClose, dismissKeyboard]);

  const handleCancel = useCallback(() => {
    dismissKeyboard();
    setName('');
    setColor(DEFAULT_COLOR);
    setSaving(false);
    onClose();
  }, [onClose, dismissKeyboard]);

  const handleBackdropPress = useCallback(() => {
    if (!saving) {
      handleCancel();
    }
  }, [saving, handleCancel]);

  const canSave = name.trim().length >= 2 && !saving;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
      statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Box className="flex-1 bg-black/60 justify-center items-center p-5">
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ThemedView className="w-full max-w-[420px] max-h-[90%] rounded-2xl p-6 shadow-2xl bg-white dark:bg-gray-800">
              <ScrollView 
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                
                <ThemedText type="title" className="mb-6 text-center text-2xl">
                  Nova Localização
                </ThemedText>

                <NameInput
                  name={name}
                  onChangeText={setName}
                  inputRef={nameInputRef}
                  editable={!saving}
                  onSubmitEditing={handleSave}
                />

                <CoordinatesDisplay
                  latitude={latitude}
                  longitude={longitude}
                />

                <ColorPickerSection
                  color={color}
                  onColorChange={handleColorChange}
                />

                <MarkerPreview
                  name={name}
                  color={color}
                />
              </ScrollView>
              
              <DialogFooter
                canSave={canSave}
                saving={saving}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            </ThemedView>
          </TouchableWithoutFeedback>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
};