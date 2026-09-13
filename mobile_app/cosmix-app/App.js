import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SelectorScreen from './screens/SelectorScreen';
import OfficeDashboard from './screens/office/OfficeDashboard';
import AttendanceCalendar from './screens/office/AttendanceCalendar';
import RequestsScreen from './screens/office/RequestsScreen';

import SiteDashboard from './screens/site/SiteDashboard';
import MaterialRequestScreen from './screens/site/MaterialRequestScreen';
import ReceiveDeliveryScreen from './screens/site/ReceiveDeliveryScreen';
import SiteRequestsScreen from './screens/site/SiteRequestsScreen';

import PurchasingDashboard from './screens/purchaser/PurchasingDashboard';
import ActivePurchaseScreen from './screens/purchaser/ActivePurchaseScreen';

import ClientDashboard from './screens/client/ClientDashboard';

import SupplierDashboard from './screens/supplier/SupplierDashboard';
import DispatchScreen from './screens/supplier/DispatchScreen';

import { View, Platform } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- BEAUTIFUL ROUNDED TAB BAR STYLES ---
const floatingTabScreenOptions = ({ route }) => ({
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '700',
    paddingBottom: Platform.OS === 'ios' ? 0 : 5,
  },
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 35, // Round edges
    height: 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderTopWidth: 0,
  },
  headerStyle: { backgroundColor: '#242b5f', elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800', fontSize: 16 },
  tabBarActiveTintColor: '#242b5f',
  tabBarInactiveTintColor: '#9ca3af',
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    // Site Staff Icons
    if (route.name === 'Dashboard') {
      iconName = focused ? 'business' : 'business-outline';
    } else if (route.name === 'MaterialRequest') {
      iconName = focused ? 'hammer' : 'hammer-outline';
    } else if (route.name === 'HR Requests') {
      iconName = focused ? 'cash' : 'cash-outline';
    } 
    // Office Staff Specific Icons
    else if (route.name === 'OfficeHome') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'Attendance') {
      iconName = focused ? 'calendar' : 'calendar-outline';
    } else if (route.name === 'OfficeRequests') {
      iconName = focused ? 'document-text' : 'document-text-outline';
    }
    // Client Specific Icons
    else if (route.name === 'ClientHome') {
      iconName = focused ? 'briefcase' : 'briefcase-outline';
    } else if (route.name === 'ClientFinance') {
      iconName = focused ? 'wallet' : 'wallet-outline';
    }

    // Wrap in a circular pill background when active
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#e0e7ff' : 'transparent',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 5,
      }}>
        <Ionicons name={iconName} size={22} color={focused ? '#242b5f' : color} />
      </View>
    );
  }
});

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={floatingTabScreenOptions}>
      <Tab.Screen name="ClientHome" component={ClientDashboard} options={{ title: 'Project Overview' }} />
      {/* Reusing Dashboard as a placeholder for Finance tab for now */}
      <Tab.Screen name="ClientFinance" component={ClientDashboard} options={{ title: 'Billing & Payments' }} />
    </Tab.Navigator>
  );
}

function SiteStaffTabs() {
  return (
    <Tab.Navigator screenOptions={floatingTabScreenOptions}>
      <Tab.Screen name="Dashboard" component={SiteDashboard} options={{ title: 'Site Home' }} />
      <Tab.Screen name="MaterialRequest" component={MaterialRequestScreen} options={{ title: 'Items' }} />
      <Tab.Screen name="HR Requests" component={SiteRequestsScreen} options={{ title: 'Leave/Loan' }} />
    </Tab.Navigator>
  );
}

function SiteStaffStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={SiteStaffTabs} />
      <Stack.Screen name="ReceiveDelivery" component={ReceiveDeliveryScreen} />
    </Stack.Navigator>
  );
}

function OfficeStaffTabs() {
  return (
    <Tab.Navigator screenOptions={floatingTabScreenOptions}>
      <Tab.Screen name="OfficeHome" component={OfficeDashboard} options={{ title: 'Home' }} />
      <Tab.Screen name="Attendance" component={AttendanceCalendar} options={{ title: 'Attendance' }} />
      <Tab.Screen name="OfficeRequests" component={RequestsScreen} options={{ title: 'Requests' }} />
    </Tab.Navigator>
  );
}

function SupplierStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={SupplierDashboard} />
      <Stack.Screen name="DispatchScreen" component={DispatchScreen} />
    </Stack.Navigator>
  );
}

function PurchasingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={PurchasingDashboard} />
      <Stack.Screen name="ActivePurchase" component={ActivePurchaseScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Selector">
        <Stack.Screen 
          name="Selector" 
          component={SelectorScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="OfficeStaffApp" 
          component={OfficeStaffTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SiteStaffApp" 
          component={SiteStaffStack} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PurchasingApp" 
          component={PurchasingStack} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ClientApp" 
          component={ClientTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SupplierApp" 
          component={SupplierStack} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
