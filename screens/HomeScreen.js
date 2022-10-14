import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
// import { doc, getDocs, collection } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const HomeScreen = ({ navigation, router }) => {
  const [users, setUsers] = useState([]);
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const usersCollectionRef = collection(db, "users");
  // console.log(`Hello ${currentUser.uid}`);

  const handleSignOut = () => {
    logout()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);

    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
  };

  useEffect(() => {
    getUsers();
    setIsLoading(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {users.map((user) => (
        <View key={user.id} style={styles.postContainer}>
          <Text style={styles.postText}>{`Email is : ${user.email}`}</Text>
          <Text style={styles.postText}>{`Name is : ${user.name}`}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    marginTop: 60
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
  postContainer: {
  
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#333",
    padding: 20,
  },
  postText: {
    color: '#fff'
  }
});
