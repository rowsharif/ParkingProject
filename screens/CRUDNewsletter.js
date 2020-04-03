//@refresh reset
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handleNewsletter = firebase.functions().httpsCallable("handleNewsletter");

const CRUDNewsletter = (props) => {
  const [newsletter, setNewsletter] = useState([]);
  const [id, setId] = useState([]);
  const [header, setHeader] = useState([]);
  const [body, setBody] = useState([]);
  const [image, setImage] = useState([]);


  useEffect(() => {
    db.collection("newsletter").onSnapshot( querySnapshot => {
      const news = [];
      querySnapshot.forEach(doc => {
        news.push({
          id: doc.id,
          ...doc.data()
        })
        // console.log("News:---: ", news);
      })
      setNewsletter([...news]);
      // console.log("-------------------",newsletter);
    }
    )
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleNewsletter({
        newsletter: { id, header, body, image },
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleNewsletter({
        newsletter: { id, header, body, image },
        operation: "add"
      });
    }
    
    setId("");
    setHeader("");
    setBody("");
    setImage("");
  };

  const handleEdit = newsletter => {
    setId(newsletter.id);
    setHeader(newsletter.header);
    setBody(newsletter.body);
    setImage(newsletter.image);
  };

  const handleDelete = async newsletter => {
    const response2 = await handleNewsletter({
      newsletter: newsletter,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
     
        {newsletter.map((newsletter, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              Hello NewsletterCRUD
            </Text>
            <Button title="Edit" onPress={() => handleEdit(newsletter)} />
            <Button title="X" onPress={() => handleDelete(newsletter)} />
          </View>
        ))}
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        // onChangeText={setPercent}
        placeholder="percent"
        value={0}
      />
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        // onChangeText={setCode}
        placeholder="code"
        // value={code}
      />
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button>

    </View>
  );
};
CRUDNewsletter.navigationOptions = {
    headerTitle: (
      <View
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        <Text
          style={{
            flex: 1,
            paddingTop: 10,
            fontSize: 18,
            fontWeight: "700",
            color: "white",
            textAlign: "center"
          }}
        >
          CRUDNewsletter
        </Text>
        <View
          style={{
            flex: 2
          }}
        ></View>
  
        <View style={{ alignSelf: "center", flex: 2 }}>
          <Image
            resizeMode="cover"
            style={{
              width: 120,
              height: 50,
              resizeMode: "contain"
            }}
            source={require("../assets/images/logo.png")}
          />
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#276b9c",
      height: 44
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  export default CRUDNewsletter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 
