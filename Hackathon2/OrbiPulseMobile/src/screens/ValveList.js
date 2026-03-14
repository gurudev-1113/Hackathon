import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Search, MapPin, Battery, ChevronRight } from 'lucide-react-native';
import { useValves } from '../context/ValveContext';

const ValveList = ({ navigation }) => {
  const { valves, loading } = useValves();
  const [search, setSearch] = useState('');

  const filteredValves = valves.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.device_id.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ValveDetail', { device: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#94a3b8" />
            <Text style={styles.location}>{item.device_id}</Text>
          </View>
        </View>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, item.status === 'OPEN' ? styles.openBadge : styles.closedBadge]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={styles.batteryContainer}>
            <Battery size={14} color={item.battery < 20 ? '#ef4444' : '#10b981'} />
            <Text style={[styles.batteryText, item.battery < 20 && styles.lowBattery]}>{item.battery}%</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#334155" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search devices..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredValves}
        renderItem={renderItem}
        keyExtractor={item => item.device_id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No devices found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  location: { color: '#94a3b8', fontSize: 12, marginLeft: 4 },
  statusSection: { alignItems: 'flex-end', marginRight: 12 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  openBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  closedBadge: { backgroundColor: 'rgba(71, 85, 105, 0.2)' },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  batteryContainer: { flexDirection: 'row', alignItems: 'center' },
  batteryText: { color: '#94a3b8', fontSize: 12, marginLeft: 4 },
  lowBattery: { color: '#ef4444' },
  empty: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 16 }
});

export default ValveList;
