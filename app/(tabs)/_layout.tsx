import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem("has_seen_welcome").then((seen) => {
      if (!seen) router.replace("/welcome");
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: "Play",
          tabBarIcon: ({ color }) => <TabIcon icon="🎮" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <TabIcon icon="🏆" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => <TabIcon icon="💎" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon }: { icon: string; color?: string }) {
  return <Text style={{ fontSize: 20 }}>{icon}</Text>;
}
