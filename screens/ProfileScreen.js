import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { Avatar } from "react-native-paper";

const ProfileScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const handleSignOut = () => {
    logout()
      .then(() => {
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
  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{ justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <View style={styles.profileContainer}>
          <Avatar.Text size={64} label={user?.name.toUpperCase()} />
          <Text>{user?.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#eee'
  },
  button: {
    backgroundColor: "#0782f9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  postText: {
    color: "#fff",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
