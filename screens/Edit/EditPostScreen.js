import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { db } from "../../firebase/config";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "./EditStyle";

const EditPostScreen = ({ navigation, route }) => {
  const item = route.params?.item;
  const [title, setTitle] = useState(item.title);
  const [detail, setDetail] = useState(item.detail);
  const [province, setProvince] = useState(item.province);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitPost = async () => {
    const timestamp = new Date();
    try {
      setIsLoading(true);

      await db
        .collection("posts")
        .doc(item.id)
        .update({
          title: title,
          detail: detail,
          province: province,
          createAt: timestamp,
        })
        .then(() => {
          Alert.alert("Update", "post updated!");
        });

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

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
    });

    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  const _onRefresh = () => {
    setTitle(item.title);
    setDetail(item.detail);
    setProvince(item.province);
  };

  useEffect(() => {
    _onRefresh();
    setIsLoading(false);
  }, [item]);

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.inputBox}>
            <Text style={[styles.textColor, styles.labelText]}>Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setTitle(text)}
              value={title.length >= 0 ? title : item.title}
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={[styles.textColor, styles.labelText]}>
              County / Province
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setProvince(text)}
              value={province.length >= 0 ? province : item.province}
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={[styles.textColor, styles.labelText]}>Detail</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setDetail(text)}
              value={title.length >= 0 ? detail : item.detail}
              multiline={true}
            />
          </View>

          <View
            style={{
              margin: 10,
              justifyContent: "space-around",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.textColor, styles.buttonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={onSubmitPost}
            >
              <Text style={[styles.textColor, styles.buttonText]}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default EditPostScreen;

