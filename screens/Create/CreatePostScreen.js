import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Button,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";

import { storage, db } from "../../firebase/config";

import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../../contexts/AuthContext";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "./CreatePostStyle";

const CreactPostScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [province, setProvince] = useState("");
  // const docRef = doc(db, "posts")
  const { currentUser } = useAuth();

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const getDate = new Date();

  const userName = currentUser.email.slice(0, 2).toUpperCase().split("@")[0];

  // const countDate = new Date("December 15, 2022 00:00:00").getTime();
  // const now = new Date().getTime();
  // const gap = countDate - now;
  // const second = 1000;
  // const minute = second * 60;
  // const hour = minute * 60;
  // const day = hour * 24;

  // const textDay = Math.floor(gap / day);
  // const textHour = Math.floor((gap % day) / hour);
  // const textMinute = Math.floor((gap % hour) / minute);
  // const textSecond = Math.floor((gap % minute) / second);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.ButtonPost}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      ),
      title: "Create Post",
    });
  });

  const postID =
    getDate.getDay() +
    "" +
    getDate.getHours() +
    "" +
    getDate.getFullYear() +
    "" +
    getDate.getSeconds() +
    "" +
    currentUser.uid;

  const postRef = db.collection("posts");

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log("Image not found.", error);
    }
  };

  // when submit post create folder data(post) in firebase

  const onSubmitPost = async () => {
    const timestamp = new Date();

    const data = {
      title: title,
      detail: detail,
      image: null,
      writerID: currentUser.uid,
      postID: postID,
      province: province,
      createAt: timestamp,
      likes: [],
      email: currentUser.email,
      userName: userName,
    };

    if (image) {
      const uri = image;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;

      setTransferred(0);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uploadUri, true);
        xhr.send(null);
      });

      const uploadRef = storage.ref(filename);
      const uploadTask = uploadRef.put(blob);

      // set progress state

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
          setTransferred(progress);
          // console.log(transferred);
        },
        (error) => {
          console.log(error);
        }
      );

      try {
        setUploading(true);
        await uploadTask;
        await uploadRef.getDownloadURL().then((url) => {
          data.image = url;
          postRef.add(data).catch((error) => {
            alert(error);
          });
        });

        Alert.alert("Post uploaded!", "Your post has been uploaded!");
        navigation.navigate("Home");
      } catch (error) {
        console.log("error", `image not found. ${error.message}`);
      }
    } else {
      Alert.alert("Image not found!", "Please select image!");
    }

    setTitle("");
    setProvince("");
    setDetail("");

    setImage(null);
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    //   setUploading(false);
    // }, 3000);
    // return () => clearInterval(interval);
  }, [uploading]);

  return (
    <ScrollView style={{ flex: 1 }} behavior="padding">
      {uploading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0782f9" />
        </View>
      ) : (
        <View style={styles.container}>
          <Pressable style={styles.uploadView} onPress={pickImage}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 20 }}
              />
            ) : (
              <Text style={styles.textColor}>{`( Upload Image here )`}</Text>
            )}
          </Pressable>

          <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1 }}
            keyboardVerticalOffset={-500}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flex: 1, alignItems: "center" }}
                  behavior="height"
                >
                  <View style={styles.inputBox}>
                    <Text style={[styles.textColor, styles.lebelText]}>
                      Title
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textColor]}
                      placeholder="Enter Title"
                      placeholderTextColor="#fff"
                      onChangeText={(text) => setTitle(text)}
                      value={title}
                    />
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={[styles.textColor, styles.lebelText]}>
                      County / Province
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textColor]}
                      placeholder="Enter County / Province"
                      placeholderTextColor="#fff"
                      onChangeText={(text) => setProvince(text)}
                      value={province}
                    />
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={[styles.textColor, styles.lebelText]}>
                      Detail
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputDetail,
                        styles.textColor,
                      ]}
                      placeholder="Enter detail"
                      placeholderTextColor="#fff"
                      onChangeText={(text) => setDetail(text)}
                      multiline={true}
                      value={detail}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.textColor, styles.buttonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonSubmit, styles.button]}
                onPress={onSubmitPost}
              >
                <Text style={[styles.textColor, styles.buttonText]}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </ScrollView>
  );
};

export default CreactPostScreen;
