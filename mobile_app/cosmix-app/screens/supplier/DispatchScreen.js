import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DispatchScreen({ navigation }) {
  const [itemsPacked, setItemsPacked] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
    }, 1500);
  };

  if (isDone) {
    return (
      <View style={styles.doneContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#047857" />
        <Text style={styles.doneTitle}>Dispatched!</Text>
        <Text style={styles.doneText}>Inventory updated. Supervisor has been notified.</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Dispatch Items</Text>
          <Text style={styles.pageSubtitle}>REQ-9082 - Defense Phase 8 Villas</Text>
        </View>

        {/* Packing Checklist */}
        <Text style={styles.sectionTitle}>1. Pick & Pack Items</Text>
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemName}>PVC Pipes (3 inch)</Text>
              <Text style={styles.itemQty}>Qty: 50 lengths</Text>
            </View>
            <Ionicons name="cube-outline" size={24} color="#6b7280" />
          </View>
          <View style={[styles.itemRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
            <View>
              <Text style={styles.itemName}>Cement Bags (Maple)</Text>
              <Text style={styles.itemQty}>Qty: 20 Bags</Text>
            </View>
            <Ionicons name="cube-outline" size={24} color="#6b7280" />
          </View>
          
          <TouchableOpacity 
            style={[styles.packBtn, itemsPacked && styles.packBtnActive]}
            onPress={() => setItemsPacked(true)}
          >
            <Ionicons name={itemsPacked ? "checkmark-done" : "cube"} size={20} color={itemsPacked ? "#047857" : "#4b5563"} style={{marginRight: 8}}/>
            <Text style={[styles.packBtnText, itemsPacked && {color: '#047857'}]}>
              {itemsPacked ? 'All Items Packed' : 'Mark Items as Packed'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Method */}
        {itemsPacked && (
          <>
            <Text style={styles.sectionTitle}>2. Handover Method</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity 
                style={[styles.methodBtn, deliveryMethod === 'self' && styles.methodBtnActive]}
                onPress={() => setDeliveryMethod('self')}
              >
                <Ionicons name="car" size={24} color={deliveryMethod === 'self' ? '#242b5f' : '#6b7280'} />
                <Text style={[styles.methodBtnText, deliveryMethod === 'self' && {color: '#242b5f'}]}>Company Driver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.methodBtn, deliveryMethod === 'rider' && styles.methodBtnActive]}
                onPress={() => setDeliveryMethod('rider')}
              >
                <Ionicons name="bicycle" size={24} color={deliveryMethod === 'rider' ? '#242b5f' : '#6b7280'} />
                <Text style={[styles.methodBtnText, deliveryMethod === 'rider' && {color: '#242b5f'}]}>Outsourced Rider</Text>
              </TouchableOpacity>
            </View>
            
            {/* NO FINANCIAL FIELDS AS REQUESTED */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#4b5563" style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>This internal transfer requires no billing. Simply mark as dispatched to update inventory and notify the site.</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, !deliveryMethod && { backgroundColor: '#9ca3af' }]}
              disabled={!deliveryMethod || isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>DISPATCH TO SITE</Text>
                  <Ionicons name="send" size={16} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </>
        )}

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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemQty: {
    fontSize: 13,
    color: '#6b7280',
  },
  packBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  packBtnActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
  },
  packBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  methodBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  methodBtnActive: {
    borderColor: '#242b5f',
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
  },
  methodBtnText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#242b5f',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  doneContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  doneText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  }
});
