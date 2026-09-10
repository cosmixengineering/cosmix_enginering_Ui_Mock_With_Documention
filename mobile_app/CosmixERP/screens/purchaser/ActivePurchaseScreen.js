import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActivePurchaseScreen({ navigation }) {
  const [vendorName, setVendorName] = useState('');
  const [billAttached, setBillAttached] = useState(false);
  const [itemsAttached, setItemsAttached] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('me'); // 'me' or 'rider'
  
  // Fake simulate payment received from company after bill upload
  const handleBillUpload = () => {
    setBillAttached(true);
    setTimeout(() => {
      setPaymentReceived(true); // Simulate company sending money/receipt back
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Process Purchase</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>PO-1029: Heavy Duty Hammer Drill</Text>
          <Text style={styles.infoText}>Vendor: Hardware City, Main Market</Text>
          <Text style={styles.infoText}>Deliver To: Karachi High-Rise Tower</Text>
        </View>

        {/* Step 1: Upload Bill */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, billAttached && styles.stepCircleDone]}>
              <Text style={[styles.stepNumber, billAttached && {color:'#fff'}]}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Vendor Details & Bill</Text>
          </View>
          
          <View style={{ marginLeft: 40, marginBottom: 16 }}>
             <Text style={styles.inputLabel}>Vendor / Shop Name (Required)</Text>
             <TextInput 
               style={styles.input} 
               placeholder="e.g. Al-Fatah Hardware"
               placeholderTextColor="#9ca3af"
               value={vendorName}
               onChangeText={setVendorName}
             />
          </View>

          {!billAttached ? (
            <TouchableOpacity 
              style={[styles.uploadBtn, !vendorName && { opacity: 0.5 }]} 
              onPress={handleBillUpload}
              disabled={!vendorName}
            >
              <Ionicons name="camera" size={24} color="#4b5563" />
              <Text style={styles.uploadBtnText}>Take Picture of Bill</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.attachedBox}>
              <Ionicons name="document-text" size={20} color="#047857" />
              <Text style={styles.attachedText}>vendor_bill_01.jpg attached</Text>
            </View>
          )}
        </View>

        {/* Step 1.5: Company Payment Status */}
        {billAttached && (
          <View style={styles.paymentStatusCard}>
            {paymentReceived ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#047857" />
                <Text style={styles.paymentStatusText}>Company transferred funds / Paid online. Proceed to collect items.</Text>
              </>
            ) : (
              <>
                <Ionicons name="time" size={24} color="#b45309" />
                <Text style={[styles.paymentStatusText, { color: '#b45309' }]}>Waiting for company payment confirmation...</Text>
              </>
            )}
          </View>
        )}

        {/* Step 2: Upload Items Photo */}
        <View style={[styles.stepContainer, !paymentReceived && { opacity: 0.5 }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, itemsAttached && styles.stepCircleDone]}>
              <Text style={[styles.stepNumber, itemsAttached && {color:'#fff'}]}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Upload Items Photo (Saman)</Text>
          </View>

          {!itemsAttached ? (
            <TouchableOpacity 
              style={styles.uploadBtn} 
              onPress={() => paymentReceived && setItemsAttached(true)}
              disabled={!paymentReceived}
            >
              <Ionicons name="camera" size={24} color="#4b5563" />
              <Text style={styles.uploadBtnText}>Take Picture of Items</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.attachedBox}>
              <Ionicons name="cube" size={20} color="#047857" />
              <Text style={styles.attachedText}>purchased_items.jpg attached</Text>
            </View>
          )}
        </View>

        {/* Step 3: Delivery Options */}
        <View style={[styles.stepContainer, !itemsAttached && { opacity: 0.5 }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepCircle, { backgroundColor: '#242b5f' }]}>
              <Text style={[styles.stepNumber, {color:'#fff'}]}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Delivery Method</Text>
          </View>

          <View style={styles.toggleRow}>
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryMethod === 'me' && styles.activeToggle]}
              onPress={() => itemsAttached && setDeliveryMethod('me')}
              disabled={!itemsAttached}
            >
              <Ionicons name="person" size={18} color={deliveryMethod === 'me' ? '#fff' : '#4b5563'} />
              <Text style={[styles.toggleText, deliveryMethod === 'me' && {color:'#fff'}]}>Deliver by Me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryMethod === 'rider' && styles.activeToggle]}
              onPress={() => itemsAttached && setDeliveryMethod('rider')}
              disabled={!itemsAttached}
            >
              <Ionicons name="bicycle" size={18} color={deliveryMethod === 'rider' ? '#fff' : '#4b5563'} />
              <Text style={[styles.toggleText, deliveryMethod === 'rider' && {color:'#fff'}]}>Deliver by Rider</Text>
            </TouchableOpacity>
          </View>

          {deliveryMethod === 'rider' && itemsAttached && (
            <View style={styles.riderChargesBox}>
              <Text style={styles.inputLabel}>Delivery / Rider Charges (Rs.)</Text>
              <TextInput 
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 500 (inDrive/Bykea)"
                placeholderTextColor="#9ca3af"
              />
            </View>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity 
          style={[styles.submitBtn, (!itemsAttached) && { backgroundColor: '#9ca3af' }]}
          disabled={!itemsAttached}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.submitBtnText}>Update Status: Going for Delivery</Text>
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  infoCard: {
    backgroundColor: '#e0e7ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3730a3',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4338ca',
    marginBottom: 4,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCircleDone: {
    backgroundColor: '#047857',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  uploadBtn: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginLeft: 40,
  },
  uploadBtnText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  attachedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    marginLeft: 40,
  },
  attachedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 8,
  },
  paymentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginLeft: 40,
    marginBottom: 24,
  },
  paymentStatusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    marginLeft: 40,
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
  },
  activeToggle: {
    backgroundColor: '#242b5f',
    borderColor: '#242b5f',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 6,
  },
  riderChargesBox: {
    marginLeft: 40,
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  submitBtn: {
    backgroundColor: '#242b5f',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  }
});
