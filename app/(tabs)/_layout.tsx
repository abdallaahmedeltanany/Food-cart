import TabIcon from "@/components/TabIcon";
import { images } from "@/constants";
import useAuthState from "@/store/auth.store";
import { Redirect, Tabs } from "expo-router";

const TabLayout = () => {
  const { isAuthenticated } = useAuthState();

  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Redirect href="/SignIn" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderRadius: 50,
          marginHorizontal: 20,
          height: 70,
          position: "absolute",
          bottom: 40,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "home",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.home} focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.bag} focused={focused} title="cart" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.search} focused={focused} title="search" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.person} focused={focused} title="profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
