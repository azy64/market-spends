import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from 'react-native-paper';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
     {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
       <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      */}
       <Tabs.Screen
        name="shop_menu"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => <Icon source={"cart"} size={28} color={color} />,
        }}
      />
     
      <Tabs.Screen
        name="graphic"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Icon size={28} source="chart-pie" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={28} source="cog-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
