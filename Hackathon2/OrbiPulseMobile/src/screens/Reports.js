import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
// Custom SVG-based charts are used instead of external libraries to keep the bundle light
import { TrendingUp, Droplet, Zap, Calendar } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width - 40;

const Reports = () => {
  // SVG-based simple bar chart component since full chart libs can be heavy
  const SimpleBar = ({ value, max, label, color }) => (
    <View style={styles.barItem}>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { height: `${(value/max) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Reports</Text>
        <Text style={styles.subtitle}>Water usage and efficiency trends</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Droplet size={20} color="#3b82f6" />
          <Text style={styles.cardTitle}>Water Usage (Last 7 Days)</Text>
        </View>
        <View style={styles.chartArea}>
          <SimpleBar value={45} max={100} label="Mon" color="#3b82f6" />
          <SimpleBar value={70} max={100} label="Tue" color="#3b82f6" />
          <SimpleBar value={30} max={100} label="Wed" color="#3b82f6" />
          <SimpleBar value={85} max={100} label="Thu" color="#3b82f6" />
          <SimpleBar value={60} max={100} label="Fri" color="#3b82f6" />
          <SimpleBar value={20} max={100} label="Sat" color="#3b82f6" />
          <SimpleBar value={15} max={100} label="Sun" color="#3b82f6" />
        </View>
        <View style={styles.statSummary}>
          <Text style={styles.summaryValue}>2,450 Gal</Text>
          <Text style={styles.summaryLabel}>Total This Week</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Zap size={20} color="#f59e0b" />
          <Text style={styles.cardTitle}>Energy Consumption</Text>
        </View>
        <View style={styles.chartArea}>
          <SimpleBar value={65} max={100} label="Mon" color="#f59e0b" />
          <SimpleBar value={55} max={100} label="Tue" color="#f59e0b" />
          <SimpleBar value={80} max={100} label="Wed" color="#f59e0b" />
          <SimpleBar value={40} max={100} label="Thu" color="#f59e0b" />
          <SimpleBar value={90} max={100} label="Fri" color="#f59e0b" />
          <SimpleBar value={30} max={100} label="Sat" color="#f59e0b" />
          <SimpleBar value={10} max={100} label="Sun" color="#f59e0b" />
        </View>
        <View style={styles.statSummary}>
          <Text style={styles.summaryValue}>124 kWh</Text>
          <Text style={styles.summaryLabel}>Est. Energy Used</Text>
        </View>
      </View>

      <View style={styles.insightBox}>
        <TrendingUp size={24} color="#10b981" />
        <View style={{ flex: 1 }}>
          <Text style={styles.insightTitle}>Efficiency Tip</Text>
          <Text style={styles.insightText}>Usage is 12% lower than last week. Your new schedule is optimizing deep root soak.</Text>
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
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 10 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  chartArea: { flexDirection: 'row', height: 160, alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 },
  barItem: { width: 30, alignItems: 'center' },
  barContainer: { height: 120, width: 12, backgroundColor: '#0f172a', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { color: '#64748b', fontSize: 10, marginTop: 8 },
  statSummary: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 16, alignItems: 'center' },
  summaryValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  summaryLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  insightBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  insightTitle: { color: '#10b981', fontSize: 14, fontWeight: 'bold' },
  insightText: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 18 }
});

export default Reports;
