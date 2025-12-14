import { ValidationResult } from './types';

export const validateMarkerName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Por favor, informe o nome da localização' };
  }
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'O nome deve ter pelo menos 2 caracteres' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'O nome deve ter no máximo 50 caracteres' };
  }
  
  return { valid: true };
};

