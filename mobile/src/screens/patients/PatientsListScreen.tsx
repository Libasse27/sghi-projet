import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, SearchBar, Avatar, FAB } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PatientsStackParamList } from '@navigation/types';
import colors from '@styles/colors';

type PatientsListNavigationProp = StackNavigationProp<
  PatientsStackParamList,
  'PatientsList'
>;

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  groupeSanguin?: string;
}

const PatientsListScreen = () => {
  const navigation = useNavigation<PatientsListNavigationProp>();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const patients: Patient[] = [
    {
      id: '1',
      nom: 'Sow',
      prenom: 'Aminata',
      dateNaissance: '1990-05-15',
      sexe: 'F',
      telephone: '+221 77 123 45 67',
      groupeSanguin: 'A+',
    },
    {
      id: '2',
      nom: 'Fall',
      prenom: 'Mamadou',
      dateNaissance: '1985-08-22',
      sexe: 'M',
      telephone: '+221 70 987 65 43',
      groupeSanguin: 'O+',
    },
    {
      id: '3',
      nom: 'Diallo',
      prenom: 'Fatou',
      dateNaissance: '1995-03-10',
      sexe: 'F',
      telephone: '+221 76 555 44 33',
      groupeSanguin: 'B+',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom[0]}${nom[0]}`.toUpperCase();
  };

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderPatient = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() =>
        navigation.navigate('PatientDetail', { patientId: item.id })
      }>
      <Avatar
        rounded
        size={60}
        title={getInitials(item.nom, item.prenom)}
        containerStyle={{
          backgroundColor: item.sexe === 'M' ? colors.secondary : colors.primary,
        }}
      />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>
          {item.prenom} {item.nom}
        </Text>
        <View style={styles.patientDetails}>
          <Icon
            name={item.sexe === 'M' ? 'gender-male' : 'gender-female'}
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.patientDetailText}>
            {item.sexe === 'M' ? 'Homme' : 'Femme'} •{' '}
            {calculateAge(item.dateNaissance)} ans
          </Text>
        </View>
        <View style={styles.patientDetails}>
          <Icon name="phone" size={16} color={colors.textSecondary} />
          <Text style={styles.patientDetailText}>{item.telephone}</Text>
        </View>
      </View>
      <View style={styles.patientActions}>
        {item.groupeSanguin && (
          <View style={styles.bloodGroupBadge}>
            <Text style={styles.bloodGroupText}>{item.groupeSanguin}</Text>
          </View>
        )}
        <Icon name="chevron-right" size={24} color={colors.gray400} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Rechercher un patient..."
        onChangeText={setSearch}
        value={search}
        platform="default"
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        leftIconContainerStyle={styles.searchIcon}
      />

      <FlatList
        data={patients.filter(
          p =>
            p.nom.toLowerCase().includes(search.toLowerCase()) ||
            p.prenom.toLowerCase().includes(search.toLowerCase()) ||
            p.telephone.includes(search)
        )}
        renderItem={renderPatient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={64} color={colors.gray300} />
            <Text style={styles.emptyText}>Aucun patient trouvé</Text>
          </View>
        }
      />

      <FAB
        icon={<Icon name="plus" size={24} color={colors.white} />}
        placement="right"
        color={colors.primary}
        onPress={() => navigation.navigate('PatientCreate')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  searchContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  patientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  patientActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bloodGroupBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodGroupText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default PatientsListScreen;
