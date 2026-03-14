import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { ShieldCheck, Wifi, Battery, Server, CheckCircle2, AlertCircle } from 'lucide-react-native';

const DeviceHealth = () => {
  const healthLogs = [
    { id: '1', device: 'Main Well', event: 'Connection Restored', time: '10 mins ago', status: 'SUCCESS' },
    { id: '2', device: 'Valve 2', event: 'Low Battery Warning', time: '1 hour ago', status: 'WARNING' },
    { id: '3', device: 'Nursery', event: 'Manual Override', time: '3 hours ago', status: 'INFO' },
  ];

  const renderLog = ({ item }) => (
    <View style={styles.logItem}>
      <View style={[styles.logIndicator, item.status === 'WARNING' ? styles.indicatorWarning : styles.indicatorSuccess]} />
      <View style={styles.logContent}>
        <Text style={styles.logEvent}>{item.event}</Text>
        <Text style={styles.logDevice}>{item.device}</Text>
      </View>
      <Text style={styles.logTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusHeader}>
          <ShieldCheck size={48} color="#10b981" />
          <Text style={styles.statusTitle}>All Systems Healthy</Text>
          <Text style={styles.statusSubtitle}>14 Devices Online • 1 Warning</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Wifi size={20} color="#3b82f6" />
            <Text style={styles.metricValue}>99.8%</Text>
            <Text style={styles.metricLabel}>Uptime</Text>
          </View>
          <View style={styles.metricCard}>
            <Battery size={20} color="#10b981" />
            <Text style={styles.metricValue}>82%</Text>
            <Text style={styles.metricLabel}>Avg Battery</Text>
          </View>
          <View style={styles.metricCard}>
            <Server size={20} color="#f59e0b" />
            <Text style={styles.metricValue}>12ms</Text>
            <Text style={styles.metricLabel}>Latency</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.logsContainer}>
          {healthLogs.map((log) => (
            <View key={log.id}>
              {renderLog({ item: log })}
              <View style={styles.divider} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  statusHeader: { alignItems: 'center', marginVertical: 32 },
  statusTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  statusSubtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  metricLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  logsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  logIndicator: { width: 4, height: 24, borderRadius: 2, marginRight: 16 },
  indicatorSuccess: { backgroundColor: '#10b981' },
  indicatorWarning: { backgroundColor: '#f59e0b' },
  logContent: { flex: 1 },
  logEvent: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  logDevice: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  logTime: { color: '#64748b', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#334155' }
});

export default DeviceHealth;
