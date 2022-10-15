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
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

const HomeScreen = ({ navigation, router }) => {
  const [users, setUsers] = useState([]);
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const usersCollectionRef = collection(db, "users");

  let docRef;

  if (currentUser) {
    docRef = doc(db, "users", currentUser.uid);
  }

  const userData = [];

  const [user, setUser] = useState([]);

  // console.log(`Hello ${currentUser.uid}`);

  const handleSignOut = () => {
    logout()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const getUsers = async () => {
    try{
      // const data = await getDocs(usersCollectionRef);
      // console.log("Usersss :",data);
      // setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const docSnap = await getDoc(docRef).catch((error) =>
        console.log(error.message)
      );

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        userData.push(docSnap?.data());
        console.log("1", userData);
        setUser(docSnap.data());
        userData.forEach((user) => console.log("2", user.email));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        setUser(null)
      }

      // console.log(users);
    }catch(error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    getUsers();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          {/* {users.map((user) => (
            <View key={user.id} style={styles.postContainer}>
              <Text style={styles.postText}>{`Email is : ${user.email}`}</Text>
              <Text style={styles.postText}>{`Name is : ${user.name}`}</Text>
            </View>
          ))} */}
          <Text>{user?.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 60,
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
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 20,
  },
  postText: {
    color: "#fff",
  },
});
