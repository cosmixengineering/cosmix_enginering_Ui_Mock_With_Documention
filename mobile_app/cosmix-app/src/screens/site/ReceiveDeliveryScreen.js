import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ReceiveDeliveryScreen({ navigation }) {
  const [itemsPhoto, setItemsPhoto] = useState(false);
  const [signPhoto, setSignPhoto] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Receive Delivery</Text>
          <Text style={styles.pageSubtitle}>Confirm receipt of incoming site materials.</Text>
        </View>

        {/* Delivery Info Card */}
        <View style={styles.deliveryCard}>
          <View style={styles.badgeTransit}>
            <Text style={styles.badgeTransitText}>ARRIVED AT SITE</Text>
          </View>
          <Text style={styles.deliveryTitle}>PO-1029: Heavy Duty Hammer Drill</Text>
          <View style={styles.deliveryRow}>
            <Ionicons name="person" size={14} color="#4b5563" />
            <Text style={styles.deliveryText}>Purchaser: Tariq Ali</Text>
          </View>
          <View style={styles.deliveryRow}>
            <Ionicons name="bicycle" size={14} color="#4b5563" />
            <Text style={styles.deliveryText}>Via: InDrive Rider</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Verification Steps</Text>

        {/* 1. Item Photo */}
        <View style={styles.stepBox}>
          <Text style={styles.label}>1. Photo of Items Received</Text>
          {!itemsPhoto ? (
            <TouchableOpacity style={styles.cameraBtn} onPress={() => setItemsPhoto(true)}>
              <Ionicons name="camera" size={24} color="#4b5563" />
              <Text style={styles.cameraBtnText}>Capture Items</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.attachedBox}>
              <Ionicons name="image" size={20} color="#047857" />
              <Text style={styles.attachedText}>received_items.jpg attached</Text>
              <TouchableOpacity onPress={() => setItemsPhoto(false)} style={{marginLeft: 'auto'}}>
                <Ionicons name="trash" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 2. Signed Paper Photo */}
        <View style={styles.stepBox}>
          <Text style={styles.label}>2. Photo of Signed Delivery Paper/Challan</Text>
          {!signPhoto ? (
            <TouchableOpacity style={styles.cameraBtn} onPress={() => setSignPhoto(true)}>
              <Ionicons name="document" size={24} color="#4b5563" />
              <Text style={styles.cameraBtnText}>Capture Signed Paper</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.attachedBox}>
              <Ionicons name="document-text" size={20} color="#047857" />
              <Text style={styles.attachedText}>signed_receipt.jpg attached</Text>
              <TouchableOpacity onPress={() => setSignPhoto(false)} style={{marginLeft: 'auto'}}>
                <Ionicons name="trash" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3. Damage Report */}
        <View style={styles.stepBox}>
          <Text style={styles.label}>3. Quality Check</Text>
          <TouchableOpacity 
            style={[styles.damageToggle, isDamaged && styles.damageToggleActive]} 
            onPress={() => setIsDamaged(!isDamaged)}
          >
            <Ionicons name={isDamaged ? "warning" : "checkmark-circle"} size={20} color={isDamaged ? "#dc2626" : "#047857"} />
            <Text style={[styles.damageToggleText, isDamaged && {color: '#dc2626'}]}>
              {isDamaged ? "Items are Damaged / Broken / Incorrect" : "All items received in good condition"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <Text style={[styles.label, isDamaged && { color: '#dc2626' }]}>
          {isDamaged ? 'Damage Details (Required)' : 'Additional Comments (Optional)'}
        </Text>
        <TextInput 
          style={[styles.textArea, isDamaged && { borderColor: '#fca5a5', backgroundColor: '#fef2f2' }]} 
          multiline={true} 
          numberOfLines={3}
          placeholder={isDamaged ? "Describe the issue or broken items..." : "Any remarks..."}
          placeholderTextColor="#9ca3af"
        />

        {/* Submit */}
        <TouchableOpacity 
          style={[styles.submitBtn, (!itemsPhoto || !signPhoto) && { backgroundColor: '#9ca3af' }]}
          disabled={!itemsPhoto || !signPhoto}
        >
          <Ionicons name="checkmark-done" size={20} color="#ffffff" style={{marginRight: 8}} />
          <Text style={styles.submitBtnText}>MARK AS RECEIVED</Text>
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
  header: {
    marginBottom: 20,
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
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeTransit: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  badgeTransitText: {
    color: '#3730a3',
    fontSize: 10,
    fontWeight: '700',
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  stepBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  cameraBtn: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  cameraBtnText: {
    marginLeft: 8,
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
  },
  attachedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 8,
  },
  damageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  damageToggleActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  damageToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#242b5f',
    paddingVertical: 16,
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
    fontSize: 15,
    fontWeight: '700',
  }
});
