import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

const Scheduler = () => {
  const { schedules } = useValves();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Watering Schedules</Text>
          <Text style={styles.subtitle}>Automate your irrigation cycles</Text>
        </View>

        {schedules.map((sch) => (
          <View key={sch.id} style={styles.card}>
            <View style={styles.cardMain}>
              <View style={styles.timeContainer}>
                <Clock size={16} color="#3b82f6" />
                <Text style={styles.time}>{sch.startTime}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.deviceName}>{sch.device}</Text>
                <View style={styles.daysContainer}>
                  {sch.days.map((day, idx) => (
                    <View key={idx} style={styles.dayBadge}>
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.duration}>Duration: {sch.duration}</Text>
              </View>
              <Switch
                value={sch.active}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.footerAction}>
                <Calendar size={14} color="#94a3b8" />
                <Text style={styles.actionText}>Edit Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerAction}>
                <Trash2 size={14} color="#ef4444" />
                <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#fff" />
          <Text style={styles.addButtonText}>Create New Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  cardMain: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  timeContainer: { alignItems: 'center', marginRight: 16, width: 60 },
  time: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  details: { flex: 1 },
  deviceName: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  dayBadge: { backgroundColor: '#334155', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dayText: { color: '#cbd5e1', fontSize: 10, fontWeight: 'bold' },
  duration: { color: '#94a3b8', fontSize: 12 },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  footerAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  actionText: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
    marginBottom: 40,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default Scheduler;
