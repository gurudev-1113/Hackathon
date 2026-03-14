import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Download, RefreshCw, Cpu, CheckCircle } from 'lucide-react-native';

const OTAUpdate = () => {
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startUpdate = () => {
    setUpdating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.1;
      setProgress(p);
      if (p >= 1) {
        clearInterval(interval);
        setUpdating(false);
      }
    }, 500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Firmware Updates</Text>
        <Text style={styles.subtitle}>Over-the-Air Device Maintenance</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Cpu size={24} color="#3b82f6" />
          <Text style={styles.cardTitle}>Current Version: v2.4.1</Text>
        </View>
        <Text style={styles.cardDesc}>New version v2.5.0 is available with improved battery optimization and sensor accuracy.</Text>
        
        {updating ? (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Updating... {Math.round(progress * 100)}%</Text>
            <View style={{ height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: '#3b82f6' }} />
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={startUpdate}>
            <Download size={20} color="#fff" />
            <Text style={styles.updateButtonText}>Download & Install v2.5.0</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Update History</Text>
        <View style={styles.historyRow}>
          <CheckCircle size={16} color="#10b981" />
          <Text style={styles.historyText}>v2.4.1 installed on Mar 12, 2024</Text>
        </View>
        <View style={styles.historyRow}>
          <CheckCircle size={16} color="#10b981" />
          <Text style={styles.historyText}>v2.4.0 installed on Feb 28, 2024</Text>
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
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  progressContainer: { marginTop: 10 },
  progressText: { color: '#fff', fontSize: 14, marginBottom: 10, textAlign: 'center' },
  historySection: { marginTop: 32 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  historyText: { color: '#94a3b8', fontSize: 14 }
});

export default OTAUpdate;
