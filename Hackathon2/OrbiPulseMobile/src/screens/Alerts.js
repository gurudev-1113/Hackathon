import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, AlertTriangle, BellOff } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

export default function AlertsScreen() {
  const { alerts } = useValves();

  if (alerts.length === 0) {
    return (
      <View style={styles.centered}>
        <LinearGradient colors={['#1e293b', '#020617']} style={styles.emptyCircle}>
          <BellOff size={40} color="#10b981" />
        </LinearGradient>
        <Text style={styles.allClearText}>All Clear!</Text>
        <Text style={styles.subText}>No active alerts detected in the network.</Text>
      </View>
    );
  }

  const renderAlert = ({ item }) => (
    <TouchableOpacity style={styles.alertWrapper}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={[styles.alertCard, item.type === 'CRITICAL' ? styles.borderCritical : styles.borderWarning]}
      >
        <View style={styles.alertHeader}>
          {item.type === 'CRITICAL' ? (
            <AlertCircle size={20} color="#ef4444" />
          ) : (
            <AlertTriangle size={20} color="#f59e0b" />
          )}
          <Text style={styles.deviceName}>{item.device}</Text>
          <Text style={styles.alertType}>{item.type}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlert}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', padding: 40 },
  emptyCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  allClearText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subText: { color: '#64748b', fontSize: 14, textAlign: 'center', marginTop: 8 },
  alertWrapper: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  alertCard: { padding: 16, borderLeftWidth: 4, borderRadius: 16 },
  borderCritical: { borderLeftColor: '#ef4444' },
  borderWarning: { borderLeftColor: '#f59e0b' },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  deviceName: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  alertType: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  message: { color: '#94a3b8', fontSize: 14, lineHeight: 20 }
});
