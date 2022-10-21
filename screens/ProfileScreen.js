import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen = ({navigation}) => {
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };


  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
