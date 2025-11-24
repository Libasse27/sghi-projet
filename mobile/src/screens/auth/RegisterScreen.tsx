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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/types';
import colors from '@styles/colors';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // TODO: Implement registration logic
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Login');
    }, 2000);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text h3 style={styles.title}>
            Créer un compte
          </Text>
          <Text style={styles.subtitle}>
            Inscrivez-vous pour accéder à l'application
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            placeholder="Nom"
            leftIcon={<Icon name="account-outline" size={24} color={colors.gray500} />}
            value={formData.nom}
            onChangeText={text => setFormData({ ...formData, nom: text })}
            autoCapitalize="words"
            disabled={isLoading}
          />

          <Input
            placeholder="Prénom"
            leftIcon={<Icon name="account-outline" size={24} color={colors.gray500} />}
            value={formData.prenom}
            onChangeText={text => setFormData({ ...formData, prenom: text })}
            autoCapitalize="words"
            disabled={isLoading}
          />

          <Input
            placeholder="Email"
            leftIcon={<Icon name="email-outline" size={24} color={colors.gray500} />}
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            placeholder="Téléphone"
            leftIcon={<Icon name="phone-outline" size={24} color={colors.gray500} />}
            value={formData.telephone}
            onChangeText={text => setFormData({ ...formData, telephone: text })}
            keyboardType="phone-pad"
            disabled={isLoading}
          />

          <Input
            placeholder="Mot de passe"
            leftIcon={<Icon name="lock-outline" size={24} color={colors.gray500} />}
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
            onChangeText={text => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            disabled={isLoading}
          />

          <Input
            placeholder="Confirmer le mot de passe"
            leftIcon={<Icon name="lock-check-outline" size={24} color={colors.gray500} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={colors.gray500}
                />
              </TouchableOpacity>
            }
            value={formData.confirmPassword}
            onChangeText={text =>
              setFormData({ ...formData, confirmPassword: text })
            }
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            disabled={isLoading}
          />

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            buttonStyle={styles.registerButton}
            containerStyle={styles.registerButtonContainer}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
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
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  registerButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
