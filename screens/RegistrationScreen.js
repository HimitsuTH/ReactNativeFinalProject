import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../styles/Styles";
import { useAuth } from "../contexts/AuthContext";

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const { signUp } = useAuth();

  const data = {
    email,
    password,
    name: email.split("@")[0],
  };

  const handleSignUp = () => {
    try {
      if (!email || !password || !conPassword) {
        alert("Pleass Enter all input :D");
      } else if (password !== conPassword) {
        alert("password don't match!!");
      } else {
        signUp(email, password, data ).then(()=> {
          navigation.navigate("Home")
        }).catch((error) => {
          console.log(error.message);
        });
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Email..."
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Password..."
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Enter Confirm Password..."
          value={conPassword}
          onChangeText={(text) => setConPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
            setEmail("");
            setPassword("");
            setConPassword("");
          }}
          style={styles.buttonOutline}
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registration;
