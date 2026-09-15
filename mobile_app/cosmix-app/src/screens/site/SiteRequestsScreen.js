import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SiteRequestsScreen() {
  const [activeTab, setActiveTab] = useState('advance'); // advance, loan, leave

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
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
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leave' && styles.activeTab]}
          onPress={() => setActiveTab('leave')}
        >
          <Text style={[styles.tabText, activeTab === 'leave' && styles.activeTabText]}>Leave</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'advance' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Site Worker - Salary Advance</Text>
            
            <View style={styles.alertBox}>
              <Ionicons name="information-circle" size={20} color="#4b5563" style={{ marginRight: 8 }} />
              <Text style={styles.alertText}>Advances are deducted from this month's site wage cycle.</Text>
            </View>

            <Text style={styles.label}>Requested Amount (Rs.)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              placeholder="e.g. 5000"
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
            <Text style={styles.formTitle}>Site Worker - Company Loan</Text>
            
            <Text style={styles.label}>Requested Amount (Rs.)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              placeholder="e.g. 50000"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Repayment Plan (Months)</Text>
            <View style={styles.pickerFake}>
              <Text style={styles.pickerText}>6 Months</Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </View>

            <Text style={styles.label}>Detailed Justification</Text>
            <TextInput 
              style={styles.textArea} 
              multiline={true} 
              numberOfLines={4}
              placeholder="Reason for loan request (Medical, Home, etc.)..."
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Loan Application</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'leave' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Site Worker - Leave Request</Text>
            
            <Text style={styles.label}>Leave Type</Text>
            <View style={styles.pickerFake}>
              <Text style={styles.pickerText}>Casual Leave</Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Start Date</Text>
                <View style={styles.pickerFake}>
                  <Text style={styles.pickerText}>10 Sep</Text>
                  <Ionicons name="calendar" size={16} color="#9ca3af" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>End Date</Text>
                <View style={styles.pickerFake}>
                  <Text style={styles.pickerText}>12 Sep</Text>
                  <Ionicons name="calendar" size={16} color="#9ca3af" />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Reason</Text>
            <TextInput 
              style={styles.textArea} 
              multiline={true} 
              numberOfLines={3}
              placeholder="Brief reason..."
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Leave Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History Section */}
        <Text style={styles.sectionTitle}>Your Previous Requests</Text>
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyType}>Salary Advance</Text>
              <Text style={styles.historyDate}>Rs. 5,000 (Aug 2026)</Text>
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
    backgroundColor: '#f3f4f6', // Clean gray background
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1f2937', // Professional dark gray
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#1f2937',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerFake: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 14,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#1f2937', // Standard corporate dark button
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
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
    color: '#111827',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  }
});
