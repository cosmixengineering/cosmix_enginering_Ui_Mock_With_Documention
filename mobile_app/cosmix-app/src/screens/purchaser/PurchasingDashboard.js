import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PurchasingDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Supply & Purchasing</Text>
            <Text style={styles.name}>Tariq Ali</Text>
            <Text style={styles.role}>Field Purchaser (Outsourced)</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TA</Text>
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusCount}>02</Text>
            <Text style={styles.statusLabel}>Assigned</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={[styles.statusCount, { color: '#047857' }]}>01</Text>
            <Text style={styles.statusLabel}>Active</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={[styles.statusCount, { color: '#3730a3' }]}>05</Text>
            <Text style={styles.statusLabel}>Delivered</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Assigned Tasks (Urgent)</Text>
        
        {/* Active Task Card */}
        <TouchableOpacity 
          style={styles.taskCard}
          onPress={() => navigation.navigate('ActivePurchase')}
        >
          <View style={styles.taskHeader}>
            <View style={styles.badgeUrgent}>
              <Text style={styles.badgeUrgentText}>URGENT</Text>
            </View>
            <Text style={styles.taskTime}>Assigned 10 mins ago</Text>
          </View>
          
          <Text style={styles.taskTitle}>Heavy Duty Hammer Drill (Bosch)</Text>
          
          <View style={styles.taskDetailsRow}>
            <Ionicons name="location" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Site: Karachi High-Rise Tower</Text>
          </View>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="business" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Vendor: Hardware City, Main Market</Text>
          </View>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="list" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Qty: 1 | Ref: PO-1029</Text>
          </View>

          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Process Purchase & Delivery</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Pending Requests</Text>
        
        {/* Pending Task Card */}
        <TouchableOpacity style={[styles.taskCard, { opacity: 0.7 }]}>
          <Text style={styles.taskTitle}>PVC Pipes (2 inch) - 50 meters</Text>
          <View style={styles.taskDetailsRow}>
            <Ionicons name="location" size={16} color="#4b5563" />
            <Text style={styles.taskDetailsText}>Site: Defense Phase 8 Villas</Text>
          </View>
          <View style={[styles.actionBtn, { backgroundColor: '#9ca3af' }]}>
            <Text style={styles.actionBtnText}>View Details</Text>
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#b45309',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeUrgent: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeUrgentText: {
    color: '#dc2626',
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
