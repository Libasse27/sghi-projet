import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Avatar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import colors from '@styles/colors';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  doctor: string;
}

const DashboardScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const stats: StatCard[] = [
    {
      title: 'Patients',
      value: '48',
      icon: 'account-group',
      color: colors.primary,
      trend: '+12%',
    },
    {
      title: 'Consultations',
      value: '24',
      icon: 'stethoscope',
      color: colors.secondary,
      trend: '+8%',
    },
    {
      title: 'Urgences',
      value: '6',
      icon: 'ambulance',
      color: colors.error,
      trend: '-5%',
    },
    {
      title: 'Rendez-vous',
      value: '15',
      icon: 'calendar-clock',
      color: colors.warning,
      trend: '+3%',
    },
  ];

  const todayAppointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Aminata Sow',
      time: '09:00',
      type: 'Consultation',
      doctor: 'Dr. Diop',
    },
    {
      id: '2',
      patientName: 'Mamadou Fall',
      time: '10:30',
      type: 'Contrôle',
      doctor: 'Dr. Ndiaye',
    },
    {
      id: '3',
      patientName: 'Fatou Diallo',
      time: '14:00',
      type: 'Urgence',
      doctor: 'Dr. Sarr',
    },
  ];

  // Chart data
  const chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [42, 38, 51, 45, 48, 35, 28],
        color: (opacity = 1) => `rgba(44, 122, 123, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(44, 122, 123, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text h4 style={styles.userName}>
            {user?.prenom} {user?.nom}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell-outline" size={24} color={colors.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
              <Icon name={stat.icon} size={28} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
            {stat.trend && (
              <View style={styles.trendContainer}>
                <Icon
                  name={
                    stat.trend.startsWith('+')
                      ? 'trending-up'
                      : 'trending-down'
                  }
                  size={14}
                  color={
                    stat.trend.startsWith('+') ? colors.success : colors.error
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color: stat.trend.startsWith('+')
                        ? colors.success
                        : colors.error,
                    },
                  ]}>
                  {stat.trend}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Patient Flow Chart */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>
          <Icon name="chart-line" size={20} color={colors.primary} /> Flux de
          patients - 7 jours
        </Card.Title>
        <LineChart
          data={chartData}
          width={width - 72}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Today's Appointments */}
      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            <Icon name="calendar-today" size={20} color={colors.primary} />{' '}
            Rendez-vous du jour
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {todayAppointments.map(appointment => (
          <TouchableOpacity key={appointment.id} style={styles.appointmentItem}>
            <Avatar
              rounded
              size={48}
              title={getInitials(appointment.patientName)}
              containerStyle={{ backgroundColor: colors.primary }}
            />
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>
                {appointment.patientName}
              </Text>
              <Text style={styles.appointmentDetails}>
                {appointment.type} • {appointment.doctor}
              </Text>
            </View>
            <View style={styles.appointmentTime}>
              <Icon name="clock-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Quick Actions */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Actions rapides</Card.Title>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="account-plus" size={32} color={colors.primary} />
            <Text style={styles.quickActionText}>Nouveau patient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="calendar-plus" size={32} color={colors.secondary} />
            <Text style={styles.quickActionText}>Rendez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="file-document" size={32} color={colors.success} />
            <Text style={styles.quickActionText}>Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="ambulance" size={32} color={colors.error} />
            <Text style={styles.quickActionText}>Urgence</Text>
          </TouchableOpacity>
        </View>
      </Card>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  appointmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appointmentDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default DashboardScreen;
