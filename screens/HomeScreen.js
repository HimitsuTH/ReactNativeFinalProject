import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
// import { doc, getDocs, collection } from "firebase/firestore";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

import { Searchbar } from "react-native-paper";

const HomeScreen = ({ navigation, router }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [searchText, setSearchText] = useState("");

  
  const usersCollectionRef = collection(db, "users");
  const postCollectionRef = collection(db, "posts");

  let docRef;

  if (currentUser) {
    docRef = doc(db, "users", currentUser.uid);
  }

  // const userData = [];

  const handleSignOut = () => {
    logout()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const getPosts = async () => {
    try {
      // const data = await getDocs(usersCollectionRef);
      // console.log("Usersss :",data);
      // setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      // Get posts
      const posts_data = await getDocs(postCollectionRef);
      setPosts(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      //Get CurrentUser
      const docSnap = await getDoc(docRef).catch((error) =>
        console.log(error.message)
      );

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
        setUser(null);
      }

      // console.log(users);
    } catch (error) {
      console.log(`Data not found. ${error.message}`);
    }
  };
  const _renderItem = ({ item }) => {
    return (
      <View>
        <Pressable
          onPress={() =>
            navigation.navigate("Post", {
              writerID: item.writerID,
            })
          }
          key={item.id}
          style={styles.postContainer}
        >
          <Text style={styles.postText}>{item.id}</Text>
          <Text style={[styles.postText, styles.title]}>{`${item.title}`}</Text>
          <Text style={styles.postText}>{`${item.detail}`}</Text>
          <View style={{ width: 350, height: 200 }}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  useEffect(() => {
    getPosts();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Searchbar
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.input}
            />

            <FlatList
              data={posts}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => <_renderItem item={item} />}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#1F1B24",
    alignItems: "center",
    shadowColor: "#eee",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.62,
    elevation: 4,
  },
  postText: {
    color: "#fff",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  input: {
    width: "100%",
    fontSize: 20,
    color: "#fff",

    borderRadius: 20,
  },
});
