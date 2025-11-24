import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, ListItem, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PatientsStackParamList } from '@navigation/types';
import colors from '@styles/colors';

type PatientDetailRouteProp = RouteProp<PatientsStackParamList, 'PatientDetail'>;

const PatientDetailScreen = () => {
  const route = useRoute<PatientDetailRouteProp>();
  const { patientId } = route.params;

  // Mock data
  const patient = {
    id: patientId,
    nom: 'Sow',
    prenom: 'Aminata',
    dateNaissance: '1990-05-15',
    sexe: 'F',
    telephone: '+221 77 123 45 67',
    email: 'aminata.sow@example.com',
    adresse: 'Dakar, Plateau',
    groupeSanguin: 'A+',
  };

  const getInitials = () => {
    return `${patient.prenom[0]}${patient.nom[0]}`.toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          rounded
          size={100}
          title={getInitials()}
          containerStyle={styles.avatar}
          titleStyle={styles.avatarTitle}
        />
        <Text h4 style={styles.name}>
          {patient.prenom} {patient.nom}
        </Text>
        <View style={styles.bloodGroupContainer}>
          <Text style={styles.bloodGroupText}>{patient.groupeSanguin}</Text>
        </View>
      </View>

      {/* Patient Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="calendar" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Date de naissance</ListItem.Title>
            <ListItem.Subtitle>{patient.dateNaissance}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon
            name={patient.sexe === 'M' ? 'gender-male' : 'gender-female'}
            size={24}
            color={colors.primary}
          />
          <ListItem.Content>
            <ListItem.Title>Sexe</ListItem.Title>
            <ListItem.Subtitle>
              {patient.sexe === 'M' ? 'Homme' : 'Femme'}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="phone" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Téléphone</ListItem.Title>
            <ListItem.Subtitle>{patient.telephone}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="email" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Email</ListItem.Title>
            <ListItem.Subtitle>{patient.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="map-marker" size={24} color={colors.primary} />
          <ListItem.Content>
            <ListItem.Title>Adresse</ListItem.Title>
            <ListItem.Subtitle>{patient.adresse}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="Modifier"
          icon={<Icon name="pencil" size={20} color={colors.white} />}
          buttonStyle={[styles.actionButton, { backgroundColor: colors.primary }]}
          containerStyle={styles.actionButtonContainer}
        />
        <Button
          title="Nouvelle consultation"
          icon={<Icon name="stethoscope" size={20} color={colors.white} />}
          buttonStyle={[styles.actionButton, { backgroundColor: colors.success }]}
          containerStyle={styles.actionButtonContainer}
        />
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
    marginBottom: 12,
  },
  bloodGroupContainer: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bloodGroupText: {
    color: colors.error,
    fontSize: 14,
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
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
  },
  actionButtonContainer: {
    marginBottom: 12,
  },
  bottomPadding: {
    height: 32,
  },
});

export default PatientDetailScreen;
