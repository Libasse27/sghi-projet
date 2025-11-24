import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ListItem, Switch } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { setTheme } from '@store/slices/appSlice';
import colors from '@styles/colors';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.app);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="theme-light-dark" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Thème sombre</ListItem.Title>
            <ListItem.Subtitle>Activer le mode sombre</ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            color={colors.primary}
          />
        </ListItem>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="bell" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Notifications push</ListItem.Title>
            <ListItem.Subtitle>Recevoir les notifications</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={true} color={colors.primary} />
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="email" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Notifications par email</ListItem.Title>
            <ListItem.Subtitle>Recevoir les emails</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={false} color={colors.primary} />
        </ListItem>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Biometric')}>
          <Icon name="fingerprint" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Authentification biométrique</ListItem.Title>
            <ListItem.Subtitle>Utiliser Face ID / Touch ID</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={false} color={colors.primary} />
        </ListItem>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Version')}>
          <Icon name="information" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Version</ListItem.Title>
            <ListItem.Subtitle>1.0.0</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Terms')}>
          <Icon name="file-document" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Conditions d'utilisation</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Privacy')}>
          <Icon name="shield-check" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Politique de confidentialité</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  listItem: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  bottomPadding: {
    height: 32,
  },
});

export default SettingsScreen;
