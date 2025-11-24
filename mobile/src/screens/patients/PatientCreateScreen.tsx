import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Input, Button, ButtonGroup } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import colors from '@styles/colors';

const PatientCreateScreen = () => {
  const navigation = useNavigation();
  const [selectedSexe, setSelectedSexe] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    adresse: '',
  });

  const handleCreate = async () => {
    setIsLoading(true);
    // TODO: Implement create patient logic
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text h4 style={styles.title}>
          Nouveau patient
        </Text>
        <Text style={styles.subtitle}>
          Remplissez les informations du patient
        </Text>

        <View style={styles.form}>
          <Input
            label="Nom *"
            placeholder="Nom de famille"
            leftIcon={<Icon name="account" size={24} color={colors.gray500} />}
            value={formData.nom}
            onChangeText={text => setFormData({ ...formData, nom: text })}
            autoCapitalize="words"
            disabled={isLoading}
          />

          <Input
            label="Prénom *"
            placeholder="Prénom"
            leftIcon={<Icon name="account" size={24} color={colors.gray500} />}
            value={formData.prenom}
            onChangeText={text => setFormData({ ...formData, prenom: text })}
            autoCapitalize="words"
            disabled={isLoading}
          />

          <View style={styles.sexeContainer}>
            <Text style={styles.label}>Sexe *</Text>
            <ButtonGroup
              buttons={['Homme', 'Femme']}
              selectedIndex={selectedSexe}
              onPress={setSelectedSexe}
              containerStyle={styles.buttonGroup}
              selectedButtonStyle={{ backgroundColor: colors.primary }}
              disabled={isLoading}
            />
          </View>

          <Input
            label="Date de naissance *"
            placeholder="JJ/MM/AAAA"
            leftIcon={<Icon name="calendar" size={24} color={colors.gray500} />}
            value={formData.dateNaissance}
            onChangeText={text =>
              setFormData({ ...formData, dateNaissance: text })
            }
            keyboardType="numeric"
            disabled={isLoading}
          />

          <Input
            label="Téléphone *"
            placeholder="+221 XX XXX XX XX"
            leftIcon={<Icon name="phone" size={24} color={colors.gray500} />}
            value={formData.telephone}
            onChangeText={text => setFormData({ ...formData, telephone: text })}
            keyboardType="phone-pad"
            disabled={isLoading}
          />

          <Input
            label="Email"
            placeholder="email@example.com"
            leftIcon={<Icon name="email" size={24} color={colors.gray500} />}
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={isLoading}
          />

          <Input
            label="Adresse"
            placeholder="Adresse complète"
            leftIcon={
              <Icon name="map-marker" size={24} color={colors.gray500} />
            }
            value={formData.adresse}
            onChangeText={text => setFormData({ ...formData, adresse: text })}
            disabled={isLoading}
          />

          <Button
            title="Créer le patient"
            onPress={handleCreate}
            loading={isLoading}
            disabled={isLoading}
            buttonStyle={styles.createButton}
            containerStyle={styles.createButtonContainer}
            icon={
              !isLoading && (
                <Icon
                  name="check"
                  size={20}
                  color={colors.white}
                  style={{ marginRight: 8 }}
                />
              )
            }
          />

          <Button
            title="Annuler"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
            type="outline"
            buttonStyle={styles.cancelButton}
            containerStyle={styles.cancelButtonContainer}
            titleStyle={{ color: colors.text }}
          />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  sexeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  buttonGroup: {
    height: 40,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  createButtonContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  cancelButton: {
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelButtonContainer: {
    marginBottom: 24,
  },
});

export default PatientCreateScreen;
