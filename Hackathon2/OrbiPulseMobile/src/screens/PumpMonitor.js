import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Activity, Gauge, Zap, TrendingUp, AlertCircle, Power } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

const PumpMonitor = () => {
  const { pumps } = useValves();

  const renderPumpCard = (pump) => (
    <View key={pump.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.pumpName}>{pump.name}</Text>
          <Text style={styles.pumpId}>{pump.id}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.powerCircle, pump.status === 'ON' ? styles.powerOn : styles.powerOff]}
          onPress={() => Alert.alert('Control', `Toggle ${pump.name} power?`)}
        >
          <Power size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Gauge size={20} color="#3b82f6" />
          <Text style={styles.statLabel}>Pressure</Text>
          <Text style={styles.statValue}>{pump.pressure} Bar</Text>
        </View>
        <View style={styles.statBox}>
          <Zap size={20} color="#f59e0b" />
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>~12.4 A</Text>
        </View>
        <View style={styles.statBox}>
          <TrendingUp size={20} color="#10b981" />
          <Text style={styles.statLabel}>Total Usage</Text>
          <Text style={styles.statValue}>{pump.usage} m³</Text>
        </View>
      </View>

      <View style={[styles.healthBadge, pump.health === 'GOOD' ? styles.healthGood : styles.healthWarning]}>
        <AlertCircle size={16} color={pump.health === 'GOOD' ? '#10b981' : '#f59e0b'} />
        <Text style={[styles.healthText, pump.health === 'GOOD' ? styles.textGood : styles.textWarning]}>
          Health: {pump.health}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Activity size={24} color="#3b82f6" />
          <Text style={styles.summaryValue}>2 Active</Text>
          <Text style={styles.summaryLabel}>Total Pumps</Text>
        </View>
        <View style={styles.summaryItem}>
          <Zap size={24} color="#f59e0b" />
          <Text style={styles.summaryValue}>4.8 kW</Text>
          <Text style={styles.summaryLabel}>Energy Rate</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pump Status</Text>
      {pumps.map(renderPumpCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16 },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 20,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  summaryLabel: { color: '#94a3b8', fontSize: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginLeft: 4 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pumpName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  pumpId: { color: '#94a3b8', fontSize: 12 },
  powerCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  powerOn: { backgroundColor: '#10b981' },
  powerOff: { backgroundColor: '#334155' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: { color: '#94a3b8', fontSize: 10, marginVertical: 4 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  healthGood: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  healthWarning: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  healthText: { fontSize: 13, fontWeight: '600' },
  textGood: { color: '#10b981' },
  textWarning: { color: '#f59e0b' }
});

export default PumpMonitor;
