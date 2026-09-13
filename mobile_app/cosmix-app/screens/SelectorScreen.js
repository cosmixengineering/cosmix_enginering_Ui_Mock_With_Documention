import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SelectorScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.title}>Cosmix Engineering</Text>
        <Text style={styles.subtitle}>Mobile Application Prototype</Text>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Select Prototype View:</Text>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('OfficeStaffApp')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e0e7ff' }]}>
            <Ionicons name="business" size={24} color="#3730a3" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Office Staff Portal</Text>
            <Text style={styles.cardDesc}>Salary, Attendance, Leave/Loan Requests</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('SiteStaffApp')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="construct" size={24} color="#b45309" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Site Staff Portal</Text>
            <Text style={styles.cardDesc}>Field tasks, Material Request, Status</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('PurchasingApp')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#ecfdf5' }]}>
            <Ionicons name="cart" size={24} color="#047857" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Supply & Purchasing</Text>
            <Text style={styles.cardDesc}>Process market orders & Vendor bills</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('SupplierApp')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#fdf4ff' }]}>
            <Ionicons name="cube" size={24} color="#c026d3" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Field Supplier</Text>
            <Text style={styles.cardDesc}>Outdoor logistics, Picking & Dispatching</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('ClientApp')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#fef2f2' }]}>
            <Ionicons name="briefcase" size={24} color="#dc2626" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Client Portal</Text>
            <Text style={styles.cardDesc}>Project Tracking, Billing, Approvals</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0 - Prototype Build</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#242b5f',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  optionsContainer: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  }
});
