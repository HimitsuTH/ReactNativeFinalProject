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
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";

import { storage, db } from "../firebase/config";

import { uploadBytes } from "firebase/storage";

import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../contexts/AuthContext";

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

      console.log(result);

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
      like: [],
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
          console.log(transferred);
        },
        (error) => {
          console.log(error);
        }
      );

      try {
        await uploadTask;
        await uploadRef.getDownloadURL().then((url) => {
          data.image = url;
          postRef.add(data).catch((error) => {
            alert(error);
          });
        });
        
        Alert.alert(
          "Image uploaded!",
          "Your image has been uploaded to the Firebase Cloud Storage Successfully!"
        );
        navigation.navigate("Home");
      } catch (error) {
        console.log(`image not found. ${error.message}`);
      }
    }

    setTitle("");
    setProvince("");
    setDetail("");
    setUploading(false);
    setImage(null);
  };

  return (
    <ScrollView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Pressable
          style={{
            width: "90%",
            backgroundColor: "#1F1B24",
            height: 250,
            marginVertical: 20,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#eee",
            borderWidth: 2,
          }}
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%", borderRadius: 20 }}
            />
          ) : (
            <Text style={{ color: "#fff" }}>{`( Upload Image here )`}</Text>
          )}
        </Pressable>

        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1 }}
          keyboardVerticalOffset={-500}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, alignItems: "center" }} behavior="height">
                <TextInput
                  style={styles.input}
                  placeholder="Enter Title"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setTitle(text)}
                  value={title}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Province"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setProvince(text)}
                  value={province}
                />
                <TextInput
                  style={[styles.input, styles.inputDetail]}
                  placeholder="Enter detail"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setDetail(text)}
                  multiline={true}
                  value={detail}
                />
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
              <Text style={{ color: "#fff" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonUpload, styles.button]}
              onPress={onSubmitPost}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default CreactPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  textTile: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    textAlignVertical: "top",
    backgroundColor: "#1F1B24",
    width: 350,
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: "#eee",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.62,
    elevation: 4,
    color: "#fff",
  },
  inputDetail: {
    height: 200,
  },
  buttonUpload: {
    backgroundColor: "#0782f9",
  },
  button: {
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 10,
    width: 150,
  },
  buttonOutline: {
    borderColor: "#eee",
    borderWidth: 2,
  },
});
