import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

const Post = ({ navigation, route }) => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  // const title = route.params.title;
  const id = route.params.writerID


 const postCollectionRef = collection(db, "posts");

  const getPost = async () => {
    try {
        const posts_data = await getDocs(postCollectionRef);
        setPost(
          posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

      console.log(post)

    } catch (error) {
      console.log(`post not found. ${error.message}`);
      setPost(null);
    }
  };

  useEffect(() => {
    getPost();
    const interval = setInterval(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearInterval(interval);
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Button title="back" onPress={() => navigation.goBack()} />
        </View>
      ),
    });
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
   
        <FlatList
          data={post.filter((post) => post.writerID == id)}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: "100%" }}
              />
              <Text
                style={[styles.postText, styles.title]}
              >{`${item.title}`}</Text>
              <Text style={styles.postText}>{`${item.detail}`}</Text>
            </View>
          )}
        />
      )}
    </>
  );
};

export default Post;

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
    width: "100%",
    height: 350,
    marginBottom: 140,
    backgroundColor: "#1F1B24",
  },
  postText: {
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});