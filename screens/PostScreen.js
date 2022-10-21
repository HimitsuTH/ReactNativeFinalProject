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
  const id = route.params.postID;

  const postCollectionRef = collection(db, "posts");

  const getPost = async () => {
    try {
      const posts_data = await getDocs(postCollectionRef);
      setPost(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      console.log(post);
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
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={post.filter((post) => post.postID == id)}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.ImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View style={{ alignItems: "center", padding: 10 }}>
                <Text style={[styles.postText, styles.title]}>
                  {item.title}
                </Text>
                <Text style={styles.postText}>
                  <Text style={{fontWeight: '700'}}>{`${item.province},  `}</Text>
                  {item.detail}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
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
  ImageContainer: {
    width: "100%",
    height: 350,
  },
  postContainer: {
    alignItems: "center",
    backgroundColor: "#1F1B24",
  },
  postText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5
  },
});
