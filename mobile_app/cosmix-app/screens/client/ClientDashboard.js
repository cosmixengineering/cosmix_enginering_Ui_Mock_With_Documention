import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ClientDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Client Portal</Text>
            <Text style={styles.name}>Mr. Fahad Mustafa</Text>
            <Text style={styles.role}>Defense Phase 8 Villas Project</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FM</Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Project Progress</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Structure & Foundation</Text>
            <Text style={styles.progressPercentage}>65%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '65%' }]} />
          </View>
          <Text style={styles.etaText}>Estimated Handover: Dec 2026</Text>
        </View>

        {/* Financial Highlights */}
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.financialGrid}>
          <View style={styles.financeBox}>
            <Text style={styles.financeLabel}>Total Contract</Text>
            <Text style={styles.financeValue}>Rs. 15.5M</Text>
          </View>
          <View style={styles.financeBox}>
            <Text style={styles.financeLabel}>Paid till date</Text>
            <Text style={[styles.financeValue, { color: '#047857' }]}>Rs. 6.2M</Text>
          </View>
          <View style={[styles.financeBox, { width: '100%', marginTop: 12 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.financeLabel}>Current Outstanding Bill</Text>
                <Text style={[styles.financeValue, { color: '#dc2626' }]}>Rs. 1.3M</Text>
              </View>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnText}>View Invoice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Approvals Needed */}
        <Text style={styles.sectionTitle}>Action Required</Text>
        <TouchableOpacity style={styles.approvalCard}>
          <View style={styles.approvalIcon}>
            <Ionicons name="document-text" size={24} color="#b45309" />
          </View>
          <View style={styles.approvalTextContainer}>
            <Text style={styles.approvalTitle}>Approve Kitchen 3D Layout</Text>
            <Text style={styles.approvalDate}>Sent on: Sep 5, 2026</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Site Updates / Reports */}
        <Text style={styles.sectionTitle}>Latest Site Updates</Text>
        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <Ionicons name="camera" size={16} color="#4b5563" />
            <Text style={styles.updateDate}>Today, 11:30 AM</Text>
          </View>
          <Text style={styles.updateText}>First floor roofing concrete poured successfully. Curing process started.</Text>
          {/* Mock Images row */}
          <View style={styles.imageGallery}>
            <View style={styles.mockImage}>
              <Ionicons name="image-outline" size={24} color="#9ca3af" />
            </View>
            <View style={styles.mockImage}>
              <Ionicons name="image-outline" size={24} color="#9ca3af" />
            </View>
            <View style={styles.mockImage}>
              <Ionicons name="image-outline" size={24} color="#9ca3af" />
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
    paddingBottom: 80, // For the floating tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    fontWeight: '500',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#242b5f',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  summaryTitle: {
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  progressPercentage: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1e1b4b',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 4,
  },
  etaText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  financeBox: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  financeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  financeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  payBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  payBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  approvalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 24,
  },
  approvalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  approvalTextContainer: {
    flex: 1,
  },
  approvalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  approvalDate: {
    fontSize: 12,
    color: '#b45309',
  },
  updateCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '600',
  },
  updateText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  imageGallery: {
    flexDirection: 'row',
    gap: 12,
  },
  mockImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
