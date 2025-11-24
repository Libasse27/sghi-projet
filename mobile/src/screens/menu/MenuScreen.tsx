import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, ListItem } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import colors from '@styles/colors';

const MenuScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuSections = [
    {
      title: 'Modules',
      items: [
        {
          icon: 'flask',
          title: 'Laboratoire',
          subtitle: 'Analyses et résultats',
          onPress: () => console.log('Laboratory'),
        },
        {
          icon: 'image-multiple',
          title: 'Imagerie',
          subtitle: 'Radiologie, échographie',
          onPress: () => console.log('Imaging'),
        },
        {
          icon: 'pill',
          title: 'Pharmacie',
          subtitle: 'Médicaments et ordonnances',
          onPress: () => console.log('Pharmacy'),
        },
        {
          icon: 'hospital-building',
          title: 'Hospitalisation',
          subtitle: 'Lits et admissions',
          onPress: () => console.log('Hospitalization'),
        },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        {
          icon: 'cog',
          title: 'Paramètres',
          subtitle: 'Configuration de l\'application',
          onPress: () => console.log('Settings'),
        },
        {
          icon: 'help-circle',
          title: 'Aide',
          subtitle: 'Documentation et support',
          onPress: () => console.log('Help'),
        },
      ],
    },
  ];

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => console.log('Profile')}>
        <Avatar
          size={64}
          rounded
          title={getInitials()}
          containerStyle={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.prenom} {user?.nom}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.gray400} />
      </TouchableOpacity>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <ListItem
              key={itemIndex}
              containerStyle={styles.listItem}
              onPress={item.onPress}>
              <Icon name={item.icon} size={24} color={colors.primary} />
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>
                  {item.title}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.itemSubtitle}>
                  {item.subtitle}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>
      ))}

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SGHI Mobile</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
});

export default MenuScreen;
