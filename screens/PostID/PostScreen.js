import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./PostIDstyle";

const Post = ({ navigation, route }) => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const title = route.params.title;
  const id = route.params.postID;

  const postCollectionRef = collection(db, "posts");

  const getPost = async () => {
    try {
      const posts_data = await getDocs(postCollectionRef);
      setPost(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // console.log(post);
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
        <TouchableOpacity
          style={{ marginHorizontal: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
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
        <ActivityIndicator size="large" color="#0782f9" style={{justifyContent: 'center', alignItems:'center', height: '100%'}}/>
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
                  <Text
                    style={{ fontWeight: "700" }}
                  >{`${item.province},  `}</Text>
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
