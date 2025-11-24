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

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    // TODO: Implement forgot password logic
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Icon name="check-circle" size={80} color={colors.success} />
          <Text h3 style={styles.successTitle}>
            Email envoyé !
          </Text>
          <Text style={styles.successText}>
            Un email de réinitialisation a été envoyé à {email}
          </Text>
          <Button
            title="Retour à la connexion"
            onPress={handleBackToLogin}
            buttonStyle={styles.backButton}
            containerStyle={styles.backButtonContainer}
          />
        </View>
      </View>
    );
  }

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
            style={styles.backButtonIcon}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Icon name="lock-reset" size={60} color={colors.primary} />
          </View>
          <Text h3 style={styles.title}>
            Mot de passe oublié ?
          </Text>
          <Text style={styles.subtitle}>
            Entrez votre email pour recevoir un lien de réinitialisation
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            placeholder="Email"
            leftIcon={
              <Icon name="email-outline" size={24} color={colors.gray500} />
            }
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            disabled={isLoading}
          />

          <Button
            title="Envoyer le lien"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading || !email}
            buttonStyle={styles.resetButton}
            containerStyle={styles.resetButtonContainer}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleBackToLogin}
            disabled={isLoading}>
            <Text style={styles.loginLinkText}>
              Retour à la connexion
            </Text>
          </TouchableOpacity>
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
  backButtonIcon: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  resetButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  successText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backButtonContainer: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
