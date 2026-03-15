import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#1a1a1a',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#666',
      }}>
      <Tabs.Screen name="index" options={{ title: 'Map' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
    </Tabs>
  );
}