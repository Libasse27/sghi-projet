import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text } from '@rneui/themed';
import colors from '@styles/colors';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <Text h1 style={styles.logo}>
            SGHI
          </Text>
          <Text style={styles.subtitle}>
            Système de Gestion Hospitalière Intégré
          </Text>
        </View>

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    color: colors.white,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.white,
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  loader: {
    marginVertical: 32,
  },
  version: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 16,
  },
});

export default SplashScreen;
