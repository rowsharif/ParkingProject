//@refresh reset
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const handleNewsletter = firebase.functions().httpsCallable("handleNewsletter");

const CRUDNewsletter = (props) => {
  const [newsletters, setNewsletters] = useState([]);
  const [id, setId] = useState("");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    db.collection("newsletter").onSnapshot((querySnapshot) => {
      const news = [];
      querySnapshot.forEach((doc) => {
        news.push({
          id: doc.id,
          ...doc.data(),
        });
        // console.log("News:---: ", news);
      });
      setNewsletters([...news]);
      console.log("-------------------", news);
    });
  }, []);

  const handleUpload = async (u) => {
    // if (uri !== image) {
    const response = await fetch(u);
    const blob = await response.blob();

    const putResult = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .put(blob);
    const url = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .getDownloadURL();

    setUri(url);
    setImage(url);
    console.log("----------------------", url);
    // setPhotoURL(url);
    // }
  };

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
      setImage(result.uri);
      handleUpload(uri);
    }
    // setProgress(0);
    // setTime(5);
  };

  const handleSend = async () => {
    if (id) {
      const response2 = await handleNewsletter({
        newsletter: { id, header, body, image },
        operation: "update",
      });
    } else {
      // call serverless function instead
      const response2 = await handleNewsletter({
        newsletter: { header, body, image },
        operation: "add",
      });
      // console.log("resssssssssssssssssssssssssss",image);
    }

    setId("");
    setHeader("");
    setBody("");
    setImage(null);
    setModalVisible(false);
  };

  const handleEdit = (newsletter) => {
    setId(newsletter.id);
    setHeader(newsletter.header);
    setBody(newsletter.body);
    setImage(newsletter.image);
    setSelectedNewsletter(newsletter);
  };

  const handleDelete = async (newsletter) => {
    const response2 = await handleNewsletter({
      newsletter: newsletter,
      operation: "delete",
    });
    setModalVisible(false);
  };

  const handleEditModal = (newsletter) => {
    handleEdit(newsletter);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setId("");
    setHeader("");
    setBody("");
    setImage(null);
    setCreate(true);
    setModalVisible(true);
  };

  return (
    // <KeyboardAvoidingView style={styles.container} behavior={Platform.Os == "ios" ? "padding" : "height"}>

    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
          {newsletters.map((newsletter, i) => (
            <View key={newsletter.id} style={{ marginLeft: "10%" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: newsletter.image }}
                  resizeMode="contain"
                  style={{ width: 50, height: 50 }}
                />
                <Text>{newsletter.header}</Text>
              </View>

              <View style={{ paddingTop: 10, flexDirection: "row" }}>
                <View style={{ minWidth: 200 }}>
                  <Text style={styles.getStartedText}>{newsletter.body}</Text>
                </View>
                <Button title="Edit" onPress={() => handleEdit(newsletter)} />
                <Button title="X" onPress={() => handleDelete(newsletter)} />
              </View>
            </View>
          ))}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TextInput
              style={{
                margin: 5,
                width: 300,
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
              }}
              onChangeText={setHeader}
              placeholder=" Header"
              value={header}
            />
            <TextInput
              style={{
                margin: 5,
                width: 300,
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
              }}
              onChangeText={setBody}
              placeholder=" Body"
              value={body}
            />
            <TextInput
              style={{
                margin: 5,
                width: 300,
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
              }}
              onChangeText={setImage}
              placeholder=" Image URL"
              value={image}
            />
          </View>

          <Button title="Send" onPress={handleSend} />
          <Button
            color="green"
            title="Back"
            onPress={() => props.navigation.goBack()}
          ></Button>
        </ScrollView>
      </ImageBackground>
    </View>
    // </KeyboardAvoidingView>
  );
};
CRUDNewsletter.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          flex: 1,
          paddingTop: 10,
          fontSize: 18,
          fontWeight: "700",
          color: "white",
          textAlign: "center",
        }}
      >
        CRUDNewsletter
      </Text>
      <View
        style={{
          flex: 2,
        }}
      ></View>

      <View style={{ alignSelf: "center", flex: 2 }}>
        <Image
          resizeMode="cover"
          style={{
            width: 120,
            height: 50,
            resizeMode: "contain",
          }}
          source={require("../assets/images/logo.png")}
        />
      </View>
    </View>
  ),
  headerStyle: {
    backgroundColor: "#276b9c",
    height: 44,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
export default CRUDNewsletter;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
