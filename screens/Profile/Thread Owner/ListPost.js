import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";



import { db, storage } from "../../../firebase/config";

import { deleteObject, ref } from "firebase/storage";

import { useAuth } from "../../../contexts/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const ListPost = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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

  // get Post with ID currentUser
  const getPostUser = async () => {
    try {
      db.collection("posts")
        .where("writerID", "==", currentUser.uid)
        .onSnapshot(async (querySnapshot) => {
          setPosts(
            await querySnapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            })
          );
        });
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
  };
  const handleDeletePost = (id, image) => {
    Alert.alert("Delete Post", "Do your want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
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
            })
            .catch((error) => {
              console.error("Error removing document: ", error);
            });
          Alert.alert("Deleted Post", "Deleted sucessfully!");
        },
      },
    ]);
  };

  const _postItem = ({ item }) => {
    return (
      <>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0782f9" />
        ) : (
          <View style={[styles.postContainer, styles.container]}>
            <View style={{ width: 50, height: 50 }}>
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              />
            </View>
            <Text style={[styles.postText, styles.title]}>{item.title}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Edit", {
                  item: item,
                })
              }
            >
              <Text style={{ color: "#fff" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeletePost(item.id, item.image)}
            >
              <AntDesign name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const _onRefresh = () => {
    getPostUser();
  };

  useEffect(() => {
    getPostUser();
    setIsLoading(false);
  }, []);
  return (
    <View>
      <FlatList
        data={posts}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <_postItem item={item} />}
        onRefresh={_onRefresh}
        refreshing={isLoading}
      />
    </View>
  );
};

export default ListPost;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
    fontSize: 15,
    fontWeight: "700",
  },
  input: {
    fontSize: 20,
    color: "#fff",
    borderRadius: 30,
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
