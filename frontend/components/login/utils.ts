export const validateEmail = (emailValue: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue.trim()) {
    return { valid: false, error: 'Email é obrigatório' };
  }
  if (!emailRegex.test(emailValue.trim())) {
    return { valid: false, error: 'Email inválido' };
  }
  return { valid: true };
};

export const validatePassword = (passwordValue: string, isLogin: boolean): { valid: boolean; error?: string } => {
  if (!passwordValue) {
    return { valid: false, error: 'Senha é obrigatória' };
  }
  
  if (!isLogin) {
    if (passwordValue.length < 8) {
      return { valid: false, error: 'A senha deve ter pelo menos 8 caracteres' };
    }
    if (!/[a-zA-Z]/.test(passwordValue)) {
      return { valid: false, error: 'A senha deve conter pelo menos 1 letra' };
    }
  }
  
  return { valid: true };
};

export const getPasswordHelperText = (password: string): string | null => {
  if (password.length === 0) return null;
  
  if (password.length < 8) {
    return `${8 - password.length} caracteres restantes`;
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return 'Adicione pelo menos 1 letra';
  }
  
  return '✓ Senha válida';
};

