import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Settings, Bell, Shield, Sliders, Save } from 'lucide-react-native';

const Configuration = () => {
  const [notifications, setNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [threshold, setThreshold] = useState('25');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>System Configuration</Text>
        <Text style={styles.subtitle}>Manage global device behavior</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={18} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Critical Alert Bypass</Text>
          <Switch value={criticalAlerts} onValueChange={setCriticalAlerts} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sliders size={18} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Thresholds</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.rowLabel}>Moisture Low-Limit (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={threshold}
            onChangeText={setThreshold}
          />
        </View>
        <Text style={styles.hint}>Triggers an alert when soil moisture drops below this value.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={18} color="#10b981" />
          <Text style={styles.sectionTitle}>Security & Updates</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Automatic OTA Updates</Text>
          <Switch value={autoUpdate} onValueChange={setAutoUpdate} />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Save size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Configuration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rowLabel: { color: '#cbd5e1', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 8 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  input: {
    backgroundColor: '#0f172a',
    color: '#fff',
    width: 60,
    height: 36,
    borderRadius: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  hint: { color: '#64748b', fontSize: 12, marginTop: 8 },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
    marginBottom: 40,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default Configuration;
