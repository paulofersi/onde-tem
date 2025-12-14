import { AuthToggle } from '@/components/login/AuthToggle';
import { EmailInput } from '@/components/login/EmailInput';
import { LoginHeader } from '@/components/login/LoginHeader';
import { NameInput } from '@/components/login/NameInput';
import { PasswordInput } from '@/components/login/PasswordInput';
import { validateEmail, validatePassword } from '@/components/login/utils';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, register } = useAuth();
  const { request, response, promptAsync } = useGoogleSignIn();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      const validation = validateEmail(text);
      setEmailError(validation.error || '');
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      const validation = validateEmail(email);
      setEmailError(validation.error || '');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError && !isLogin) {
      const validation = validatePassword(text, isLogin);
      setPasswordError(validation.error || '');
    }
  };

  const handlePasswordBlur = () => {
    if (password.trim() && !isLogin) {
      const validation = validatePassword(password, isLogin);
      setPasswordError(validation.error || '');
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  };

  const handleSubmit = async () => {
    setEmailError('');
    setPasswordError('');

    if (!isLogin && !name.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!isLogin) {
      const passwordValidation = validatePassword(password, isLogin);
      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.error || '');
        return;
      }
    } else {
      if (!password.trim()) {
        setPasswordError('Senha é obrigatória');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || `Erro ao ${isLogin ? 'fazer login' : 'registrar'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!request) {
        Alert.alert('Erro', 'Google Sign-In não está pronto. Aguarde alguns segundos e tente novamente.');
        return;
      }
      
      setGoogleLoading(true);
      const result = await promptAsync();
      
      if (result && result.type === 'success') {
        await authService.loginWithGoogleResult(result);
      } else if (result && result.type === 'error') {
        Alert.alert('Erro', result.error?.message || result.error?.toString() || 'Não foi possível fazer login com Google');
      } else if (result && result.type !== 'cancel') {
        Alert.alert('Erro', 'Não foi possível fazer login com Google');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login com Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50 dark:bg-gray-900" useSafeArea={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled">
          <LoginHeader isLogin={isLogin} />

          <Box className="w-full">
            {!isLogin && (
              <NameInput
                name={name}
                onChangeText={setName}
                editable={!loading}
              />
            )}

            <EmailInput
              email={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              error={emailError}
              editable={!loading}
            />

            <PasswordInput
              password={password}
              onChangeText={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError}
              isLogin={isLogin}
              editable={!loading}
            />

            <Button
              variant="solid"
              onPress={handleSubmit}
              disabled={loading || googleLoading}
              className={`w-full mt-2 ${loading || googleLoading ? 'opacity-60' : ''}`}>
              {loading
                ? 'Carregando...'
                : isLogin
                ? 'Entrar'
                : 'Criar Conta'}
            </Button>

            {/* Divisor */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              <ThemedText className="mx-4 text-sm text-gray-500 dark:text-gray-400">
                ou
              </ThemedText>
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </View>

            {/* Botão Google */}
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className={`flex-row items-center justify-center w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                loading || googleLoading ? 'opacity-60' : ''
              }`}
              activeOpacity={0.7}>
              <Ionicons
                name="logo-google"
                size={20}
                color={Platform.OS === 'ios' ? '#4285F4' : '#EA4335'}
              />
              <ThemedText className="ml-3 font-semibold text-gray-900 dark:text-gray-100">
                {googleLoading ? 'Conectando...' : 'Continuar com Google'}
              </ThemedText>
            </TouchableOpacity>

            <AuthToggle
              isLogin={isLogin}
              onToggle={handleToggle}
              disabled={loading || googleLoading}
            />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
