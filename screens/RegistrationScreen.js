import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../styles/Styles";
import { useAuth } from "../contexts/AuthContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import { TextInput } from "react-native-paper";

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const { signUp } = useAuth();
  const [userID, setUserID] = useState("");

  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);

  const data = {
    email,
    password,
    name: email.split("@")[0],
  };
  const handleProfile = (data, userId) => {
    console.log(userId);
    setDoc(doc(db, "users", userId), {
      email: data.email,
      name: data.name,
      userId: userId,
    });
    setUserID(userId);

    console.log(userId);
  };
  const handleSignUp = async () => {
    try {
      if (!email || !password || !conPassword) {
        alert("Pleass Enter all input :D");
      } else if (password !== conPassword) {
        alert("password don't match!!");
      } else {
        await signUp(email, password)
          .then((userCredential) => {
            handleProfile(data, userCredential.user.uid);
          })
          .then(() => {
            Alert.alert("Sign Up", "registration successfully!", [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("Home", {
                    userID: userID,
                  }),
              },
            ]);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text style={styles.TitleText}>Sign Up</Text>
        <Text style={styles.subText}>Welcome To Travel App</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Email..."
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            theme={{ roundness: 10 }}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Password..."
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry={eye1}
            right={
              <TextInput.Icon
                icon={!eye1 ? "eye-off" : "eye"}
                onPress={() => setEye1(!eye1)}
              />
            }
            theme={{ roundness: 10 }}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Confirm Password..."
            value={conPassword}
            onChangeText={(text) => setConPassword(text)}
            style={styles.input}
            secureTextEntry={eye2}
            right={
              <TextInput.Icon
                icon={!eye2 ? "eye-off" : "eye"}
                onPress={() => setEye2(!eye2)}
              />
            }
            theme={{ roundness: 10 }}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styles.subText, { padding: 5 }]}>
            Have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              setEmail("");
              setPassword("");
              setConPassword("");
            }}
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonOutlineText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registration;
