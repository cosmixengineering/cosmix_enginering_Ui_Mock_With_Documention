import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function InventoryDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Central Warehouse</Text>
            <Text style={styles.name}>Tariq Mehmood</Text>
            <Text style={styles.role}>Inventory Manager</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1 }]}>
            <Ionicons name="layers" size={28} color="#3b82f6" />
            <Text style={styles.statCount}>1,240</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 }]}>
            <Ionicons name="warning" size={28} color="#ef4444" />
            <Text style={styles.statCount}>8</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1 }]}>
            <Ionicons name="git-pull-request" size={28} color="#22c55e" />
            <Text style={styles.statCount}>5</Text>
            <Text style={styles.statLabel}>Pending Issues</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Inventory Operations</Text>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('StockList')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#e0e7ff' }]}>
            <Ionicons name="list" size={24} color="#4f46e5" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Manage Stock Levels</Text>
            <Text style={styles.actionDesc}>View, add, or update warehouse inventory</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('IssueMaterial')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#fce7f3' }]}>
            <Ionicons name="cube" size={24} color="#db2777" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Issue Materials to Site</Text>
            <Text style={styles.actionDesc}>Process requests & assign to Field Supplier</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="log-in" size={24} color="#d97706" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Inward Stock (Receiving)</Text>
            <Text style={styles.actionDesc}>Add stock from Purchaser/Vendor drops</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f5' },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 14, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 4 },
  role: { fontSize: 14, color: '#3b82f6', fontWeight: '500', marginTop: 2 },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#242b5f',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24,
  },
  statBox: {
    flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4,
  },
  statCount: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#4b5563', marginTop: 4, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  actionIcon: {
    width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  actionTextContainer: { flex: 1, marginLeft: 16 },
  actionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  actionDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
});
