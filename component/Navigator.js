import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; 

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuth } from "../contexts/AuthContext";

// Screens Component
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import Registration from "../screens/RegistrationScreen";
import CreactPostScreen from "../screens/CreactPostScreen";
import SearchScreen from "../screens/SearchScreen";

import { Avatar } from "react-native-paper";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthRoute = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Register"
        component={Registration}
      />
      <Stack.Screen name="Home_" component={MyTab} />
    </Stack.Navigator>
  );
};

const MyTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-sharp";
          } else if (route.name === "Post") {
            iconName = "add-circle";
          } else if (route.name === "Search") {
            iconName = "search";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0782f9",
        tabBarInactiveTintColor: "gray",
        headerRight: () => (<Text style={{padding: 20}}>Hello</Text>)
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={CreactPostScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false, //hide tab bar on this screen
        }}
      />
    </Tab.Navigator>
  );
};

const Navigator = () => {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      {currentUser ? <MyTab /> : <AuthRoute />}
    </NavigationContainer>
  );
};

export default Navigator;
