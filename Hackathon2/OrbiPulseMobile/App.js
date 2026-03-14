import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { ValveProvider } from './src/context/ValveContext';

// Screens
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import DashboardScreen from './src/screens/Dashboard';
import AlertsScreen from './src/screens/Alerts';
import ProfileScreen from './src/screens/Profile';
import ValveList from './src/screens/ValveList';
import ValveDetail from './src/screens/ValveDetail';
import PumpMonitor from './src/screens/PumpMonitor';
import Scheduler from './src/screens/Scheduler';
import ConditionMonitoring from './src/screens/ConditionMonitoring';
import DeviceHealth from './src/screens/DeviceHealth';
import Configuration from './src/screens/Configuration';
import OTAUpdate from './src/screens/OTAUpdate';
import Reports from './src/screens/Reports';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="ValveDetail" component={ValveDetail} />
    </Stack.Navigator>
  );
}

function MainDrawer({ setIsLoggedIn }) {
  return (
    <Drawer.Navigator screenOptions={{ 
        headerStyle: { backgroundColor: '#0f172a', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#0f172a', width: 280 },
        drawerActiveTintColor: '#10b981',
        drawerInactiveTintColor: '#94a3b8',
      }}>
      <Drawer.Screen name="Dashboard" component={DashboardStack} />
      <Drawer.Screen name="Valves" component={ValveList} />
      <Drawer.Screen name="Alerts" component={AlertsScreen} />
      <Drawer.Screen name="Pump Monitor" component={PumpMonitor} />
      <Drawer.Screen name="Schedules" component={Scheduler} />
      <Drawer.Screen name="Conditions" component={ConditionMonitoring} />
      <Drawer.Screen name="Health" component={DeviceHealth} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="Settings" component={Configuration} />
      <Drawer.Screen name="Updates" component={OTAUpdate} />
      <Drawer.Screen name="Profile">
        {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@OrbiPulse:IsLoggedIn');
        if (value === 'true') {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.warn('Failed to fetch login status');
      } finally {
        setIsReady(true);
      }
    };
    checkLoginStatus();
  }, []);

  const handleSetIsLoggedIn = async (value) => {
    try {
      if (value) {
        await AsyncStorage.setItem('@OrbiPulse:IsLoggedIn', 'true');
      } else {
        await AsyncStorage.removeItem('@OrbiPulse:IsLoggedIn');
      }
      setIsLoggedIn(value);
    } catch (e) {
      console.warn('Failed to save login status');
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ValveProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} setIsLoggedIn={handleSetIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="Main">
              {props => <MainDrawer {...props} setIsLoggedIn={handleSetIsLoggedIn} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ValveProvider>
  );
}
