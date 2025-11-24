import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, FAB } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const AppointmentsListScreen = () => {
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Aminata Sow',
      date: '2024-01-15',
      time: '09:00',
      type: 'Consultation',
      doctor: 'Dr. Diop',
      status: 'confirmed',
    },
    {
      id: '2',
      patientName: 'Mamadou Fall',
      date: '2024-01-15',
      time: '10:30',
      type: 'Contrôle',
      doctor: 'Dr. Ndiaye',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.primary;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray400;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.timeContainer}>
          <Icon name="clock-outline" size={20} color={colors.primary} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.appointmentContent}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
        <View style={styles.doctorContainer}>
          <Icon name="doctor" size={16} color={colors.textSecondary} />
          <Text style={styles.doctorText}>{item.doctor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={64} color={colors.gray300} />
            <Text style={styles.emptyText}>Aucun rendez-vous</Text>
          </View>
        }
      />

      <FAB
        icon={<Icon name="plus" size={24} color={colors.white} />}
        placement="right"
        color={colors.primary}
        onPress={() => console.log('Create appointment')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  listContent: {
    padding: 16,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentContent: {},
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  doctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
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

export default AppointmentsListScreen;
