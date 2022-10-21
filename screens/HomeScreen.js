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
  Button,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase/config";
// import { doc, getDocs, collection } from "firebase/firestore";
import { deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

import { Searchbar } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
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
      const posts_data = await getDocs(postCollectionRef);
      setPosts(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      console.log("TEST", posts);

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

  // when click Delete post with Id
  const handleDeletePost = (id, image) => {
    const desertRef = ref(storage, image);
    console.log(id);
    db.collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
            console.log("File deleted successfully");
          })
          .catch((error) => {
            console.log(error);
          });
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
   
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Avatar.Text size={34} label={item.userName} />
          <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
            {item.email}
          </Text>
        </View>
        <Text style={{ color: "#fff", fontSize: 14, marginBottom: 10 }}>
          {new Date(item.createAt.toDate()).toISOString().slice(0, 10)}
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate("Post", {
              postID: item.postID,
            })
          }
          key={item.id}
          style={{ alignItems: "center" }}
        >
          <Text style={[styles.postText, styles.title]}>{item.title}</Text>

          <Text style={styles.postText} numberOfLines={2}>
            <Text style={{ fontWeight: "600", fontSize: 18 }}>
              {`${item.province},  `}
            </Text>
            {item.detail}
          </Text>

          <View style={{ width: 350, height: 200 }}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
            />
          </View>
        </Pressable>
        {item.writerID === currentUser.uid && (
          <TouchableOpacity
            onPress={() => handleDeletePost(item.id, item.image)}
            style={{ margin: 15, alignItems: "flex-end" }}
          >
            <AntDesign name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const _onRefresh = () => {
    getPosts();
  };

  useEffect(() => {
    getPosts();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 2000);
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
              renderItem={_renderItem}
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
});
