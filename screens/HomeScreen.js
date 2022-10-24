import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Pressable,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect , useCallback} from "react";

import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase/config";

import { deleteObject, ref } from "firebase/storage";

import { AntDesign } from "@expo/vector-icons";

import { Avatar } from "react-native-paper";
import { Searchbar } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  // const [posts, setPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  // const [user, setUser] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [likeStatus, setLikeStatus] = useState(true);
  const [search, setSearch] = useState("");

  // let docRef;

  // if (currentUser) {
  //   docRef = doc(db, "users", currentUser.uid);
  // }

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

      // console.log("TETETE", posts);

      // const posts_data = await getDocs(postCollectionRef);
      // setPosts(posts_data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      // console.log("TEST", posts);

      //Get CurrentUser
      // const docSnap = await getDoc(docRef).catch((error) =>
      //   console.log(error.message)
      // );

      // if (docSnap.exists()) {
      //   // console.log("Document data:", docSnap.data());
      //   setUser(docSnap.data());
      // } else {
      //   console.log("No such document!");
      //   setUser(null);
      // }

      // console.log("This is Log from Home", user);
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

  // function for Like Post
  const onLikePost = (id, likes) => {
    console.log(`id: ${id} likes: ${likes}`);
    let tempLikes = likes;

    try {
      if (tempLikes.length > 0) {
        //check User like post return id user
        const idFilter = tempLikes.filter(
          (idc) => idc.idLike === currentUser.uid
        );
        // console.log("ID : ", idFilter);

        const index = tempLikes.indexOf(idFilter[0]);
        // console.log("INDEX :", index);

        if (index > -1) {
          tempLikes.splice(index, 1);
        } else {
          tempLikes.push({ idLike: currentUser.uid, likeStatus });
        }
      } else {
        tempLikes.push({ idLike: currentUser.uid, likeStatus });
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(tempLikes);

    db.collection("posts")
      .doc(id)
      .update({
        likes: tempLikes,
      })
      .then(() => {
        console.log("post updated!");
      });
  };

  const _postItem = (({ item }) => {
    const userLike = item.likes.filter((idc) => idc.idLike === currentUser.uid);
    return (
      <View style={styles.postContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            marginRight: 10,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar.Text size={34} label={item.userName} />
            <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
              {item.email}
            </Text>
          </View>
          {item.writerID === currentUser.uid && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Edit", {
                  item: item,
                })
              }
            >
              <Text style={{ color: "#fff" }}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ color: "#fff", fontSize: 14, marginBottom: 10 }}>
          {new Date(item?.createAt.toDate()).toISOString().slice(0, 10)}
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
        <View style={styles.mediaContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.postText}>
              {`${item.likes?.length > 0 ? item.likes?.length : "0"}  Likes`}
            </Text>

            <TouchableOpacity
              style={{ margin: 15 }}
              onPress={() => onLikePost(item.id, item.likes)}
            >
              {userLike[0]?.likeStatus ? (
                <AntDesign name="heart" size={24} color="red" />
              ) : (
                <AntDesign name="hearto" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {item.writerID === currentUser.uid && (
            <TouchableOpacity
              onPress={() => handleDeletePost(item.id, item.image)}
              style={{ margin: 15 }}
            >
              <AntDesign name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        onIconPress={() => {
          setSearch(searchText);
          setIsLoading(true);
          const interval = setInterval(() => {
            setIsLoading(false);
          }, 1000);
          return () => clearInterval(interval);
        }}
      />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0782f9"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <FlatList
            data={
              search
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
            renderItem={({ item }) => <_postItem item={item} />}
            onRefresh={_onRefresh}
            refreshing={isLoading}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </SafeAreaView>
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
