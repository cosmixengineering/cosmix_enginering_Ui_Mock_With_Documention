import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Platform, TouchableOpacity, StatusBar } from 'react-native';

import SelectorScreen from '../screens/SelectorScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import OfficeDashboard from '../screens/office/OfficeDashboard';
import AttendanceCalendar from '../screens/office/AttendanceCalendar';
import RequestsScreen from '../screens/office/RequestsScreen';
import SiteDashboard from '../screens/site/SiteDashboard';
import MaterialRequestScreen from '../screens/site/MaterialRequestScreen';
import ReceiveDeliveryScreen from '../screens/site/ReceiveDeliveryScreen';
import SiteRequestsScreen from '../screens/site/SiteRequestsScreen';
import PurchasingDashboard from '../screens/purchaser/PurchasingDashboard';
import ActivePurchaseScreen from '../screens/purchaser/ActivePurchaseScreen';
import ClientDashboard from '../screens/client/ClientDashboard';
import SupplierDashboard from '../screens/supplier/SupplierDashboard';
import DispatchScreen from '../screens/supplier/DispatchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- PREMIUM TAB BAR STYLES ---
const tabScreenOptions = ({ route, navigation }) => ({
  tabBarShowLabel: true,
  tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: Platform.OS === 'ios' ? 0 : 8 },
  tabBarStyle: { backgroundColor: '#ffffff', height: Platform.OS === 'ios' ? 88 : 68, borderTopWidth: 1, borderTopColor: '#f3f4f6', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 8, paddingTop: 8 },
  headerStyle: { backgroundColor: '#242b5f', elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800', fontSize: 18 },
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Selector')} style={{ paddingLeft: 16, paddingRight: 10 }}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  ),
  tabBarActiveTintColor: '#242b5f',
  tabBarInactiveTintColor: '#9ca3af',
  tabBarIcon: ({ focused, color, size }) => {
    let iconName = 'ellipse-outline';
    if (route.name === 'Dashboard') iconName = focused ? 'business' : 'business-outline';
    else if (route.name === 'MaterialRequest') iconName = focused ? 'hammer' : 'hammer-outline';
    else if (route.name === 'HR Requests') iconName = focused ? 'cash' : 'cash-outline';
    else if (route.name === 'OfficeHome') iconName = focused ? 'home' : 'home-outline';
    else if (route.name === 'Attendance') iconName = focused ? 'calendar' : 'calendar-outline';
    else if (route.name === 'OfficeRequests') iconName = focused ? 'document-text' : 'document-text-outline';
    else if (route.name === 'ClientHome') iconName = focused ? 'briefcase' : 'briefcase-outline';
    else if (route.name === 'ClientFinance') iconName = focused ? 'wallet' : 'wallet-outline';
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? '#e0e7ff' : 'transparent', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20, marginBottom: 2 }}>
        <Ionicons name={iconName} size={22} color={focused ? '#3730a3' : '#9ca3af'} />
      </View>
    );
  }
});

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="ClientHome" component={ClientDashboard} options={{ title: 'Project Overview' }} />
      <Tab.Screen name="ClientFinance" component={ClientDashboard} options={{ title: 'Billing & Payments' }} />
    </Tab.Navigator>
  );
}

function SiteStaffTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
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
    <Tab.Navigator screenOptions={tabScreenOptions}>
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Selector" component={SelectorScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OfficeStaffApp" component={OfficeStaffTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SiteStaffApp" component={SiteStaffStack} options={{ headerShown: false }} />
        <Stack.Screen name="PurchasingApp" component={PurchasingStack} options={{ headerShown: false }} />
        <Stack.Screen name="ClientApp" component={ClientTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierApp" component={SupplierStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
