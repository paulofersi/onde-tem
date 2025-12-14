export interface AddMarkerDialogProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

