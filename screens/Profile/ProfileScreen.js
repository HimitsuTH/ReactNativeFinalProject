import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import { Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./ProfileStyle";

const ProfileScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const handleSignOut = () => {
    logout()
      .then(() => {
        Alert.alert("Sign Out", "Log out successfully!");
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const getUser = async () => {
    setIsLoading(true);

    try {
      db.collection("users")
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          setUser(doc.data());
        });

      // userRef.get().then((doc) => {
      //   if (doc.exists) {
      //     console.log("Doument data: ", doc.data());
      //     setUser(doc.data());
      //   } else {
      //     // doc.data() will be undefined in this case
      //     console.log("No such document!");
      //   }
      // });
    } catch (error) {
      console.log("Error getting document: ", error);
    }
  };

  // const nameLength = user?.name.length
  // const name1 = user?.name.toUpperCase()[0];
  const name2 = user?.name.slice(0, 2).toUpperCase();


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.ButtonPost}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0782f9"
          style={{ justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <View style={styles.profileContainer}>
          <View style={{ alignItems: "center" }}>
            <Avatar.Text size={64} label={name2} />
            <Text style={[styles.textColor, styles.textEmail]}>
              {user?.email}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#333",
              padding: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#eee",
            }}
            onPress={() => navigation.navigate("Thread Owner")}
          >
            <Text style={[styles.textColor, styles.buttonText]}>See Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={[styles.textColor, styles.buttonText]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
