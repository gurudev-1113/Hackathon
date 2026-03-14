import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Thermometer, Droplet, Wind, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

const ConditionMonitoring = () => {
  const { sensors } = useValves();

  const getIcon = (type) => {
    switch (type) {
      case 'TEMPERATURE': return <Thermometer size={24} color="#f59e0b" />;
      case 'MOISTURE': return <Droplet size={24} color="#3b82f6" />;
      case 'HUMIDITY': return <Wind size={24} color="#10b981" />;
      default: return <Droplet size={24} color="#94a3b8" />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil & Climate</Text>
        <Text style={styles.subtitle}>Current environmental conditions</Text>
      </View>

      <View style={styles.sensorGrid}>
        {sensors.map((sensor) => (
          <View key={sensor.id} style={styles.sensorCard}>
            <View style={styles.iconContainer}>{getIcon(sensor.type)}</View>
            <Text style={styles.sensorValue}>{sensor.value}{sensor.unit}</Text>
            <Text style={styles.sensorName}>{sensor.name}</Text>
            <View style={styles.trendRow}>
              <TrendingDown size={14} color="#ef4444" />
              <Text style={styles.trendText}>-2% vs last hour</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Insights</Text>
        <View style={styles.insightItem}>
          <View style={[styles.indicator, { backgroundColor: '#10b981' }]} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Optimal Moisture</Text>
            <Text style={styles.insightDesc}>Soil moisture levels are within the healthy range for current growth phase.</Text>
          </View>
        </View>
        <View style={styles.insightItem}>
          <View style={[styles.indicator, { backgroundColor: '#f59e0b' }]} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>High Evaporation Risk</Text>
            <Text style={styles.insightDesc}>Temp is rising and humidity is dropping. Consider shorter, more frequent watering.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  sensorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sensorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sensorValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sensorName: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 },
  trendText: { color: '#94a3b8', fontSize: 10 },
  section: {
    backgroundColor: '#1e293b',
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  insightItem: { flexDirection: 'row', marginBottom: 20, gap: 12 },
  indicator: { width: 4, borderRadius: 2, height: '100%' },
  insightContent: { flex: 1 },
  insightTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  insightDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 18 }
});

export default ConditionMonitoring;
