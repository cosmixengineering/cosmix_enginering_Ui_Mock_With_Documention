import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SupplierDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Field Operations</Text>
            <Text style={styles.name}>Imran Khan</Text>
            <Text style={styles.role}>Field Supplier / Logistics</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IK</Text>
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusCount}>04</Text>
            <Text style={styles.statusLabel}>Pending</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={[styles.statusCount, { color: '#047857' }]}>02</Text>
            <Text style={styles.statusLabel}>Packing</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={[styles.statusCount, { color: '#3730a3' }]}>12</Text>
            <Text style={styles.statusLabel}>Dispatched</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Approved Material Requests</Text>
        
        {/* Active Task Card */}
        <TouchableOpacity 
          style={styles.taskCard}
          onPress={() => navigation.navigate('DispatchScreen')}
        >
          <View style={styles.taskHeader}>
            <View style={styles.badgeUrgent}>
              <Text style={styles.badgeUrgentText}>APPROVED</Text>
            </View>
            <Text style={styles.taskTime}>Requested by: Site Supervisor</Text>
          </View>
          
          <Text style={styles.taskTitle}>PVC Pipes & Cement Bags</Text>
          
          <View style={styles.taskDetailsRow}>
            <Ionicons name="location" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Destination: Defense Phase 8 Villas</Text>
          </View>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="list" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Items: 2 | Ref: REQ-9082</Text>
          </View>

          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Pick & Dispatch</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recently Dispatched</Text>
        
        {/* Pending Task Card */}
        <TouchableOpacity style={[styles.taskCard, { opacity: 0.7 }]}>
          <Text style={styles.taskTitle}>Safety Helmets (10x)</Text>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="location" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Destination: Karachi High-Rise Tower</Text>
          </View>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="checkmark-done" size={16} color="#047857" />
            <Text style={[styles.taskDetailsText, {color: '#047857', fontWeight: '600'}]}>Status: On the way</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 2,
  },
  role: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#242b5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusBox: {
    backgroundColor: '#ffffff',
    width: '31%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#242b5f',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeUrgent: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeUrgentText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '700',
  },
  taskTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  taskDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskDetailsText: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#242b5f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
  }
});
