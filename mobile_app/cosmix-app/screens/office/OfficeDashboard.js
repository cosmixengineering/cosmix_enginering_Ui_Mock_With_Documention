import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OfficeDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header / Profile Summary */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>Salman Ahmed</Text>
            <Text style={styles.role}>Senior Accountant (Head Office)</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SA</Text>
          </View>
        </View>

        {/* Salary Widget */}
        <View style={styles.salaryCard}>
          <View style={styles.salaryHeader}>
            <Text style={styles.salaryTitle}>Current Month Salary</Text>
            <Text style={styles.salaryMonth}>September 2026</Text>
          </View>
          <Text style={styles.salaryAmount}>Rs. 85,000</Text>
          <View style={styles.salaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Present</Text>
              <Text style={[styles.statValue, { color: '#047857' }]}>08</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Leaves</Text>
              <Text style={[styles.statValue, { color: '#b45309' }]}>01</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Holidays</Text>
              <Text style={[styles.statValue, { color: '#3730a3' }]}>01</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Requests')}>
            <View style={[styles.actionIcon, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="calendar-outline" size={24} color="#3730a3" />
            </View>
            <Text style={styles.actionText}>Req Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Requests')}>
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="cash-outline" size={24} color="#b45309" />
            </View>
            <Text style={styles.actionText}>Advance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Requests')}>
            <View style={[styles.actionIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="wallet-outline" size={24} color="#047857" />
            </View>
            <Text style={styles.actionText}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Finance')}>
            <View style={[styles.actionIcon, { backgroundColor: '#f3f4f6' }]}>
              <Ionicons name="document-text-outline" size={24} color="#4b5563" />
            </View>
            <Text style={styles.actionText}>Payslips</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="checkmark-circle" size={16} color="#3730a3" />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Leave Request Approved</Text>
              <Text style={styles.activityDate}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="cash" size={16} color="#047857" />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>August Salary Credited</Text>
              <Text style={styles.activityDate}>Sep 1, 2026</Text>
            </View>
          </View>
        </View>

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
    fontSize: 14,
    color: '#6b7280',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 2,
  },
  role: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#242b5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  salaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  salaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  salaryMonth: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  salaryAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#242b5f',
    marginBottom: 20,
  },
  salaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: '500',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  }
});
