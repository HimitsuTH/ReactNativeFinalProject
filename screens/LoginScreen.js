import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { styles } from "../styles/Styles";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password, navigation).then(() => {
        navigation.navigate("Home");
      });
    } catch (error) {
      console.log(error.message);

      setIsError("password or email is invalid");
    }
  };





  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          underlineColorAndroid="transparent"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
          underlineColorAndroid="transparent"
        />
      </View>
      {isError && <Text style={{ color: "red", marginTop: 5 }}>{isError}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Register");
            setEmail("");
            setPassword("");
          }}
          style={styles.buttonOutline}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
