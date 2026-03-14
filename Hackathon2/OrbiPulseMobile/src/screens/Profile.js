import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Moon, LogOut, ChevronRight, ShieldCheck } from 'lucide-react-native';

export default function ProfileScreen({ setIsLoggedIn }) {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  const renderSettingRow = (icon, label, value, onValueChange, isSwitch = true) => (
    <View style={styles.settingRow}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.settingText}>{label}</Text>
      {isSwitch ? (
        <Switch 
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#334155", true: "#10b981" }}
          thumbColor="#fff"
        />
      ) : (
        <ChevronRight size={20} color="#475569" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={['#1e293b', '#020617']} style={styles.header}>
        <LinearGradient colors={['#10b981', '#3b82f6']} style={styles.avatar}>
          <User size={40} color="#fff" />
        </LinearGradient>
        <Text style={styles.name}>Admin User</Text>
        <Text style={styles.email}>admin@gmail.com</Text>
        <View style={styles.badge}>
            <ShieldCheck size={14} color="#10b981" />
            <Text style={styles.badgeText}>System Administrator</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow(<Bell size={20} color="#3b82f6" />, "Push Notifications", notifications, setNotifications)}
          <View style={styles.divider} />
          {renderSettingRow(<Moon size={20} color="#f59e0b" />, "Dark Appearance", darkMode, setDarkMode)}
        </View>

        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow(<ShieldCheck size={20} color="#10b981" />, "Two-Factor Auth", false, null, false)}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => setIsLoggedIn(false)}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out of Network</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>App Version 2.4.1 (Stable Build)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#10b981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 16, color: '#94a3b8', marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12, gap: 6 },
  badgeText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4, letterSpacing: 1 },
  sectionCard: { backgroundColor: '#0f172a', borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden', marginBottom: 24 },
  settingRow: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { color: '#fff', fontSize: 16, flex: 1, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#1e293b', marginLeft: 72 },
  logoutButton: { flexDirection: 'row', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', gap: 12, marginTop: 10 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  version: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 40 }
});
