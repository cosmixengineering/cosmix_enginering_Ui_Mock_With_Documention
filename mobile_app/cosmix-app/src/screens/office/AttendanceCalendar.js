import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AttendanceCalendar() {
  // Mock data for 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = i + 1;
    // Mock simple logic: Sundays are holidays, some absents
    const isSunday = date % 7 === 6; // Just mock math
    let status = 'present';
    if (isSunday) status = 'holiday';
    else if (date === 12) status = 'absent';
    else if (date === 25) status = 'leave';
    else if (date > 28) status = 'upcoming';

    return { date, status };
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' };
      case 'absent': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      case 'leave': return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };
      case 'holiday': return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
      default: return { bg: '#f9fafb', text: '#9ca3af', border: '#e5e7eb' }; // upcoming
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.monthTitle}>September 2026</Text>
          <View style={styles.navButtons}>
            <Ionicons name="chevron-back" size={24} color="#6b7280" />
            <Ionicons name="chevron-forward" size={24} color="#6b7280" style={{ marginLeft: 16 }} />
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#047857' }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#b45309' }]} />
            <Text style={styles.legendText}>Leave</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3730a3' }]} />
            <Text style={styles.legendText}>Holiday</Text>
          </View>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarCard}>
          <View style={styles.weekDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>
          
          <View style={styles.daysGrid}>
            {/* Empty slots for visual offset */}
            <View style={styles.dayCell} />
            <View style={styles.dayCell} />
            
            {days.map((d, i) => {
              const colors = getStatusColor(d.status);
              return (
                <View key={i} style={styles.dayCell}>
                  <View style={[styles.dayCircle, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    <Text style={[styles.dayText, { color: colors.text }]}>{d.date}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Monthly Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Working Days</Text>
            <Text style={styles.summaryValue}>24</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Days Present</Text>
            <Text style={[styles.summaryValue, { color: '#047857' }]}>22</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Days Absent / Unpaid</Text>
            <Text style={[styles.summaryValue, { color: '#dc2626' }]}>01</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.summaryLabel}>Paid Leaves</Text>
            <Text style={[styles.summaryValue, { color: '#b45309' }]}>01</Text>
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
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  navButtons: {
    flexDirection: 'row',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: '500',
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    width: 32,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  }
});
