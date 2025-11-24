import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '@store';
import { loginUser } from '@store/slices/authSlice';
import { AuthStackParamList } from '@navigation/types';
import colors from '@styles/colors';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation is handled automatically by RootNavigator based on auth state
    } catch (err) {
      // Error is already set in Redux state
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text h2 style={styles.logo}>
              SGHI
            </Text>
          </View>
          <Text h3 style={styles.title}>
            Connexion
          </Text>
          <Text style={styles.subtitle}>
            Connectez-vous à votre compte
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Global error message */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <Input
            placeholder="Email"
            leftIcon={
              <Icon name="email-outline" size={24} color={colors.gray500} />
            }
            value={formData.email}
            onChangeText={text => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: '' });
            }}
            errorMessage={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            disabled={isLoading}
          />

          {/* Password Input */}
          <Input
            placeholder="Mot de passe"
            leftIcon={
              <Icon name="lock-outline" size={24} color={colors.gray500} />
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={colors.gray500}
                />
              </TouchableOpacity>
            }
            value={formData.password}
            onChangeText={text => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: '' });
            }}
            errorMessage={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            disabled={isLoading}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={isLoading}>
            <Text style={styles.forgotPasswordText}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            buttonStyle={styles.loginButton}
            containerStyle={styles.loginButtonContainer}
            icon={
              !isLoading && (
                <Icon
                  name="login"
                  size={20}
                  color={colors.white}
                  style={{ marginRight: 8 }}
                />
              )
            }
          />

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <Text style={styles.registerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SGHI - Système de Gestion Hospitalière
          </Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    color: colors.white,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  loginButtonContainer: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  footerVersion: {
    color: colors.textLight,
    fontSize: 10,
    marginTop: 4,
  },
});

export default LoginScreen;
