import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Avatar, ListItem } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store';
import { logoutUser } from '@store/slices/authSlice';
import colors from '@styles/colors';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => dispatch(logoutUser()),
        },
      ]
    );
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          title={getInitials()}
          containerStyle={styles.avatar}
          titleStyle={styles.avatarTitle}
        />
        <Text h4 style={styles.name}>
          {user?.prenom} {user?.nom}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>{user?.role}</Text>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="phone" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Téléphone</ListItem.Title>
            <ListItem.Subtitle>{user?.telephone || 'Non renseigné'}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="email" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Email</ListItem.Title>
            <ListItem.Subtitle>{user?.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Edit profile')}>
          <Icon name="account-edit" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Modifier le profil</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => console.log('Change password')}>
          <Icon name="lock-reset" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Changer le mot de passe</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  avatarTitle: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  roleContainer: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

export default ProfileScreen;
