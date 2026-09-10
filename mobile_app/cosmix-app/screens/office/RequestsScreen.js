import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RequestsScreen() {
  const [activeTab, setActiveTab] = useState('leave'); // leave, advance, loan

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leave' && styles.activeTab]}
          onPress={() => setActiveTab('leave')}
        >
          <Text style={[styles.tabText, activeTab === 'leave' && styles.activeTabText]}>Leave</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'advance' && styles.activeTab]}
          onPress={() => setActiveTab('advance')}
        >
          <Text style={[styles.tabText, activeTab === 'advance' && styles.activeTabText]}>Advance</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'loan' && styles.activeTab]}
          onPress={() => setActiveTab('loan')}
        >
          <Text style={[styles.tabText, activeTab === 'loan' && styles.activeTabText]}>Loan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'leave' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Leave Request</Text>
            
            <Text style={styles.label}>Leave Type</Text>
            <View style={styles.pickerFake}>
              <Text style={styles.pickerText}>Annual Leave (Paid)</Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Start Date</Text>
                <View style={styles.pickerFake}>
                  <Text style={styles.pickerText}>10 Sep, 2026</Text>
                  <Ionicons name="calendar" size={16} color="#9ca3af" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>End Date</Text>
                <View style={styles.pickerFake}>
                  <Text style={styles.pickerText}>12 Sep, 2026</Text>
                  <Ionicons name="calendar" size={16} color="#9ca3af" />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Reason</Text>
            <TextInput 
              style={styles.textArea} 
              multiline={true} 
              numberOfLines={4}
              placeholder="Briefly explain the reason for your leave..."
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'advance' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Salary Advance Request</Text>
            
            <View style={styles.alertBox}>
              <Ionicons name="information-circle" size={20} color="#047857" style={{ marginRight: 8 }} />
              <Text style={styles.alertText}>Limit: Max 50% of Basic Salary (Rs. 42,500). Recovered from next month's payroll.</Text>
            </View>

            <Text style={styles.label}>Requested Amount (Rs.)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              placeholder="e.g. 15000"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Reason for Advance</Text>
            <TextInput 
              style={styles.textArea} 
              multiline={true} 
              numberOfLines={3}
              placeholder="Optional: Provide a reason..."
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Advance Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'loan' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Company Loan Request</Text>
            
            <Text style={styles.label}>Requested Amount (Rs.)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              placeholder="e.g. 100000"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Installment Plan (Months)</Text>
            <View style={styles.pickerFake}>
              <Text style={styles.pickerText}>12 Months</Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </View>

            <Text style={styles.label}>Justification</Text>
            <TextInput 
              style={styles.textArea} 
              multiline={true} 
              numberOfLines={4}
              placeholder="Provide detailed justification for the loan committee..."
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Apply for Loan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History Section */}
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyType}>Sick Leave</Text>
              <Text style={styles.historyDate}>15 Aug, 2026 - 16 Aug, 2026</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }]}>
              <Text style={[styles.badgeText, { color: '#047857' }]}>Approved</Text>
            </View>
          </View>
          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyType}>Salary Advance</Text>
              <Text style={styles.historyDate}>Rs. 10,000 (July 2026)</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#f3f4f6', borderColor: '#d1d5db' }]}>
              <Text style={[styles.badgeText, { color: '#4b5563' }]}>Recovered</Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#242b5f',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#242b5f',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  pickerFake: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  pickerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: '#065f46',
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#242b5f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  }
});
