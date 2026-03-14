import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Droplet, Battery, Shield, ArrowUpRight } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

export default function DashboardScreen({ navigation }) {
  const { valves, loading, refreshing, fetchValves, sensors } = useValves();

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.headerTitle}>Network Summary</Text>
      <View style={styles.summaryGrid}>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.summaryCard}>
          <Activity size={20} color="#10b981" />
          <Text style={styles.summaryValue}>{valves.length}</Text>
          <Text style={styles.summaryLabel}>Nodes</Text>
        </LinearGradient>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.summaryCard}>
          <Droplet size={20} color="#3b82f6" />
          <Text style={styles.summaryValue}>{valves.filter(v => v.status === 'OPEN').length}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </LinearGradient>
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.summaryCard}>
          <Shield size={20} color="#f59e0b" />
          <Text style={styles.summaryValue}>{sensors.length}</Text>
          <Text style={styles.summaryLabel}>Sensors</Text>
        </LinearGradient>
      </View>
      <Text style={styles.sectionTitle}>Connected Devices</Text>
    </View>
  );

  const renderValve = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardWrapper}
      onPress={() => navigation.navigate('Valves', { screen: 'ValveDetail', params: { device: item } })}
    >
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.deviceId}>{item.device_id}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'OPEN' ? styles.statusOpen : styles.statusClosed]}>
            <Text style={[styles.statusText, item.status === 'OPEN' ? { color: '#10b981' } : { color: '#ef4444' }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.metric}>
            <Battery size={14} color={item.battery < 20 ? '#ef4444' : '#94a3b8'} />
            <Text style={[styles.metricText, item.battery < 20 && { color: '#ef4444' }]}>{item.battery}%</Text>
          </View>
          <View style={styles.metric}>
            <Droplet size={14} color="#3b82f6" />
            <Text style={styles.metricText}>{item.flow_rate || 0} GPM</Text>
          </View>
          <ArrowUpRight size={16} color="#475569" style={{ marginLeft: 'auto' }} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={valves}
        keyExtractor={(item) => item.device_id}
        renderItem={renderValve}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchValves(true)}
            tintColor="#10b981"
            colors={['#10b981']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
  headerSection: { marginBottom: 24, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  summaryGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  summaryLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  cardWrapper: { marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
  card: { padding: 16, borderWidth: 1, borderColor: '#334155', borderRadius: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deviceId: { color: '#64748b', fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusOpen: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  statusClosed: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricText: { color: '#94a3b8', fontSize: 13, fontWeight: '500' }
});
