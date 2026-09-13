import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SiteDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile & Site Summary */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Site Portal</Text>
            <Text style={styles.name}>Mike Johnson</Text>
            <Text style={styles.role}>Site Supervisor / Field Tech</Text>
            <View style={styles.siteBadge}>
              <Ionicons name="location" size={12} color="#b45309" />
              <Text style={styles.siteBadgeText}>Karachi High-Rise Tower</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MJ</Text>
          </View>
        </View>

        {/* Today's Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Punch In</Text>
              <Text style={styles.statusValue}>08:15 AM</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <Text style={[styles.statusValue, { color: '#047857' }]}>Active on Site</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Site Operations</Text>
        
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('MaterialRequest')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="build" size={28} color="#3730a3" />
            </View>
            <Text style={styles.gridTitle}>Material / Tools</Text>
            <Text style={styles.gridDesc}>Request items or report damage</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('HR Requests')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="cash" size={28} color="#b45309" />
            </View>
            <Text style={styles.gridTitle}>Advance & Loan</Text>
            <Text style={styles.gridDesc}>Request salary advance or leave</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="camera" size={28} color="#047857" />
            </View>
            <Text style={styles.gridTitle}>Site Progress</Text>
            <Text style={styles.gridDesc}>Upload daily work photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="warning" size={28} color="#dc2626" />
            </View>
            <Text style={styles.gridTitle}>Safety Hazard</Text>
            <Text style={styles.gridDesc}>Report immediate issues</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Incoming Deliveries</Text>

        <TouchableOpacity 
          style={styles.deliveryCard}
          onPress={() => navigation.navigate('ReceiveDelivery')}
        >
          <View style={styles.deliveryHeader}>
            <View style={styles.badgeTransit}>
              <Text style={styles.badgeTransitText}>ARRIVING TODAY</Text>
            </View>
          </View>
          
          <Text style={styles.deliveryTitle}>Heavy Duty Hammer Drill (Bosch)</Text>
          
          <View style={styles.deliveryRow}>
            <Ionicons name="bicycle" size={16} color="#4b5563" />
            <Text style={styles.deliveryText}>Via: InDrive Rider</Text>
          </View>

          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Receive Item</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
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
  },
  siteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  siteBadgeText: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: '700',
    marginLeft: 4,
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
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  deliveryHeader: {
    marginBottom: 12,
  },
  badgeTransit: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTransitText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '700',
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
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
    marginTop: 12,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
  }
});
