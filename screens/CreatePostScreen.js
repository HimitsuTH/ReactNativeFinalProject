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
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
// import { doc, addDoc } from "firebase/firestore"; 
// import { db } from "../firebase/config";

import { useAuth } from "../contexts/AuthContext";




const CreactPostScreen = ({ navigation }) => {
  const [title , setTitle] = useState("");
  const [detail , setDetail] = useState("");
  const [province, setProvince] = useState("");
  // const docRef = doc(db, "posts")
  const { currentUser } = useAuth();

  // const handleSubmit = async () => {
  //   await addDoc(docRef, {
  //     title,
  //     detail,
  //     province,
  //     writerID: currentUser.uid,
  //     likes: [],
  //   });
  // }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Button title="Post"  />
        </View>
      ),
    });
  }, [navigation]);
  return (
    <ScrollView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <View
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
        >
          <Text style={{ color: "#fff" }}>{`( Upload Image here )`}</Text>
        </View>
        <TouchableOpacity style={[styles.buttonUpload, styles.button]}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Upload Image</Text>
        </TouchableOpacity>

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
                  onChangeText={(text)=> setDetail(text)}
                  value={detail}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: "#fff" }}>Cancel</Text>
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
