import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase/config";
import { deleteObject, ref } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { styles } from "../screens/HomeScreen";

const _post = ({ item, navigation }) => {
  const [likeStatus, setLikeStatus] = useState(true);
  const { currentUser } = useAuth();
  // when click Delete post with Id

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

  const onLikePost = (id, likes) => {
    console.log(`id: ${id} likes: ${likes}`);
    let tempLikes = likes;
   
    try {
     
      if (tempLikes.length > 0) {
        const idFilter = tempLikes.filter(
          (idc) => idc.idLike === currentUser.uid
        );
        console.log("ID : ", idFilter);

        const index = tempLikes.indexOf(idFilter[0]);
        console.log("INDEX :", index);

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

    console.log(tempLikes);

    db.collection("posts")
      .doc(id)
      .update({
        likes: tempLikes,
      })
      .then(() => {
        console.log("post updated!");
      });
  };

  const userLike = item.likes.filter((idc) => idc.idLike === currentUser.uid);


  // console.log("FFFF", userLike[0]?.likeStatus);
  userLike[0]?.likeStatus ? console.log("true") : console.log("false");

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
};

export default _post;
