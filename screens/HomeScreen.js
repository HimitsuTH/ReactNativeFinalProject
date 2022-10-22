import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase/config";
import { deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { AntDesign } from "@expo/vector-icons";

import { Avatar } from "react-native-paper";
import { Searchbar } from "react-native-paper";

import _post from "../component/_post";

const HomeScreen = ({ navigation }) => {
  // const [posts, setPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [searchText, setSearchText] = useState("");

  const postCollectionRef = db.collection("posts").orderBy("createAt", "desc");

  let docRef;

  if (currentUser) {
    docRef = doc(db, "users", currentUser.uid);
  }

  const getPosts = async () => {
    try {
      // const data = await getDocs(usersCollectionRef);
      // console.log("Usersss :",data);
      // setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      // Get posts
      db.collection("posts")
        .orderBy("createAt", "desc")
        .onSnapshot(async (querySnapshot) => {
          setPosts(
            await querySnapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            })
          );
        });

      console.log("TETETE", posts);

      // const posts_data = await getDocs(postCollectionRef);
      // setPosts(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      // console.log("TEST", posts);

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

      console.log("This is Log from Home", user);
    } catch (error) {
      console.log(`Data not found. ${error.message}`);
    }
  };

  const _onRefresh = () => {
    getPosts();
  };

  useEffect(() => {
    getPosts();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.ButtonPost}
          onPress={() => navigation.navigate("PostCreate")}
        >
          <Text style={{ fontWeight: "700", fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      ),
    });

    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
    });
    return unsubscribe;
  }, [navigation]);

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
              data={
                searchText
                  ? posts.filter((post) =>
                      post.title
                        .toUpperCase()
                        .includes(
                          searchText.toUpperCase().trim().replace(/\s/g, "")
                        )
                    )
                  : posts
              }
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => <_post item={item} navigation={navigation}/>}
              onRefresh={_onRefresh}
              refreshing={isLoading}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

export const styles = StyleSheet.create({
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
  ButtonPost: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 100 / 2,
    width: 35,
    height: 24,
  },
  mediaContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
