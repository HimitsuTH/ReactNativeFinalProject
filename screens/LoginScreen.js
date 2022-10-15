import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { styles } from "../styles/Styles";

import { TextInput } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");
  const [eye, setEye] = useState(true);

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password, navigation).then(() => {
        navigation.navigate("Home");
        setIsError("");
      });
    } catch (error) {
      console.log(error.message);

      setIsError("password or email is invalid");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 60 }}>
        <Text style={styles.TitleText}>Sign In</Text>
        <Text style={styles.subText}>Welcom back To Travel App</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter your email address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            theme={{ roundness: 10 }}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            theme={{ roundness: 10 }}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry={eye}
            right={
              <TextInput.Icon
                icon={!eye ? "eye-off" : "eye"}
                onPress={() => setEye(!eye)}
              />
            }
          />
        </View>
      </View>
      {isError && <Text style={{ color: "red", marginTop: 5 }}>{isError}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styles.subText, { padding: 5 }]}>No account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
              setEmail("");
              setPassword("");
              setIsError("");
            }}
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonOutlineText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
