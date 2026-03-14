import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Battery, Droplet, Activity, Shield, Clock, AlertTriangle } from 'lucide-react-native';

const ValveDetail = ({ route, navigation }) => {
  const { device } = route.params;
  const [isOpen, setIsOpen] = useState(device.status === 'OPEN');
  const [isAuto, setIsAuto] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={styles.id}>{device.device_id}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Battery size={24} color={device.battery < 20 ? '#ef4444' : '#10b981'} />
          <Text style={styles.statValue}>{device.battery}%</Text>
          <Text style={styles.statLabel}>Battery</Text>
        </View>
        <View style={styles.statCard}>
          <Droplet size={24} color="#3b82f6" />
          <Text style={styles.statValue}>{device.flow_rate || 0}</Text>
          <Text style={styles.statLabel}>GPM Flow</Text>
        </View>
        <View style={styles.statCard}>
          <Activity size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{device.current || 0}A</Text>
          <Text style={styles.statLabel}>Current</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.controlRow}>
          <View>
            <Text style={styles.controlTitle}>Manual Control</Text>
            <Text style={styles.controlDesc}>{isOpen ? 'Valve is currently open' : 'Valve is currently closed'}</Text>
          </View>
          <Switch
            value={isOpen}
            onValueChange={setIsOpen}
            trackColor={{ false: '#334155', true: '#10b981' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.controlRow}>
          <View>
            <Text style={styles.controlTitle}>Automated Mode</Text>
            <Text style={styles.controlDesc}>Follow irrigation schedules</Text>
          </View>
          <Switch
            value={isAuto}
            onValueChange={setIsAuto}
            trackColor={{ false: '#334155', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <View style={styles.infoRow}>
          <Shield size={18} color="#94a3b8" />
          <Text style={styles.infoLabel}>Firmware Version</Text>
          <Text style={styles.infoValue}>v2.4.1</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={18} color="#94a3b8" />
          <Text style={styles.infoLabel}>Last Seen</Text>
          <Text style={styles.infoValue}>2 mins ago</Text>
        </View>
        <View style={styles.infoRow}>
          <AlertTriangle size={18} color="#94a3b8" />
          <Text style={styles.infoLabel}>Signal Strength</Text>
          <Text style={styles.infoValue}>Excellent (-65dBm)</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('Reports', { deviceId: device.device_id })}
      >
        <Text style={styles.historyButtonText}>View Usage Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 24, backgroundColor: '#1e293b' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  id: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  statsGrid: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  statLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  section: {
    backgroundColor: '#1e293b',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  controlDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { flex: 1, color: '#94a3b8', marginLeft: 12 },
  infoValue: { color: '#fff', fontWeight: '500' },
  historyButton: {
    margin: 16,
    backgroundColor: '#3b82f6',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  historyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ValveDetail;
