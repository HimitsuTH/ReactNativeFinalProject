import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import React from "react";

const CreactPostScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            backgroundColor: "#333",
            height: 250,
            marginVertical: 20,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>{`( Upload Image here )`}</Text>
        </View>
        <Text style={styles.textTile}>Plane</Text>
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            keyboardVerticalOffset={-200}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, alignItems: "center" }} behavior="height">
                <TextInput style={styles.input} placeholder="Enter Title" />
                <TextInput
                  style={[styles.input, styles.inputDetail]}
                  placeholder="Enter detail"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: "#eee",
    width: 350,
    padding: 15,
    borderRadius: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  inputDetail: {
    height: 200,
  },
});
