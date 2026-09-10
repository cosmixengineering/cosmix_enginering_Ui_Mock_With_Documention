import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MaterialRequestScreen() {
  const [requestType, setRequestType] = useState('new'); // new, damage
  const [isPhotoAttached, setIsPhotoAttached] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.pageTitle}>Material & Tool Request</Text>
        <Text style={styles.pageSubtitle}>Request inventory from central store or report damaged items at site.</Text>

        {/* Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, requestType === 'new' && styles.activeToggle]}
            onPress={() => setRequestType('new')}
          >
            <Text style={[styles.toggleText, requestType === 'new' && styles.activeToggleText]}>Request New Items</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, requestType === 'damage' && styles.activeToggle]}
            onPress={() => setRequestType('damage')}
          >
            <Text style={[styles.toggleText, requestType === 'damage' && styles.activeToggleText]}>Report Damage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Search & Select Item</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="e.g. Drilling Machine, Cement, Wire..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Fake Selected Item */}
          <View style={styles.selectedItem}>
            <View>
              <Text style={styles.itemName}>Heavy Duty Hammer Drill (Bosch)</Text>
              <Text style={styles.itemCode}>SKU: HD-4592</Text>
            </View>
            <View style={styles.qtyBox}>
              <Text style={styles.qtyLabel}>Qty</Text>
              <Text style={styles.qtyValue}>1</Text>
            </View>
          </View>

          {/* Issue/Reason text */}
          <Text style={styles.label}>
            {requestType === 'new' ? 'Reason for Request' : 'Damage Details'}
          </View>
          <TextInput 
            style={styles.textArea} 
            multiline={true} 
            numberOfLines={4}
            placeholder={requestType === 'new' ? "Why is this item needed at the site?" : "Describe how it got damaged and current condition..."}
            placeholderTextColor="#9ca3af"
          />

          {/* Camera / Photo Attachment */}
          <Text style={styles.label}>Attach Photo (Required for Damage)</Text>
          {isPhotoAttached ? (
            <View style={styles.photoAttachedBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="image" size={24} color="#047857" />
                <Text style={styles.photoText}>damage_evidence_1.jpg</Text>
              </View>
              <TouchableOpacity onPress={() => setIsPhotoAttached(false)}>
                <Ionicons name="close-circle" size={24} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.cameraBtn}
              onPress={() => setIsPhotoAttached(true)}
            >
              <Ionicons name="camera" size={32} color="#242b5f" />
              <Text style={styles.cameraBtnText}>Tap to Open Camera</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn}>
            <Ionicons name="paper-plane" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>Submit to Central Store</Text>
          </TouchableOpacity>
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
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeToggleText: {
    color: '#1f2937',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
  },
  itemCode: {
    fontSize: 11,
    color: '#0284c7',
    marginTop: 2,
  },
  qtyBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 10,
    color: '#0284c7',
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0369a1',
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
  cameraBtn: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#f9fafb',
  },
  cameraBtnText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  photoAttachedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  photoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 8,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#242b5f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  }
});
