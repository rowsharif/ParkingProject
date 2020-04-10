//@refresh reset
import React, { useState, useEffect, useReducer } from "react";
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
  Picker,
} from "react-native";
import * as Animatable from "react-native-animatable";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleFAQ = firebase.functions().httpsCallable("handleFAQ");

const FAQ = (props) => {
  const [uid, setuid] = useState();

  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [id, setId] = React.useState("");

  const [user, setUser] = useState([]);

  useEffect(() => {
    console.log("uid", firebase.auth().currentUser.uid);
    setuid(firebase.auth().currentUser.uid);
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        const user = { id: doc.id, ...doc.data() };
        setUser(user);
        console.log("USERS", user);
      });
  }, []);

  useEffect(() => {
    db.collection("FAQs").onSnapshot((querySnapshot) => {
      const faqs = [];
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() });
      });

      console.log(" Current faqs: ", faqs);

      setFaqs([...faqs]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleFAQ({
        faq: { id, question, answer },
        operation: "update",
      });
    } else {
      const response2 = await handleFAQ({
        faq: { question, answer },

        operation: "add",
      });
    }
    setQuestion("");
    setAnswer("");
    setId("");
  };
  const handleEdit = (faq) => {
    setQuestion(faq.question);

    setAnswer(faq.answer);

    setId(faq.id);
  };

  const handleDelete = async (faq) => {
    const response2 = await handleFAQ({
      faq: faq,
      operation: "delete",
    });
  };
  return (
    <View style={styles.container}>
      {/* {user && user.role && user.role == "manager" ? ( */}
      {faqs.map((faq, i) => (
        <View key={i}>
          <Text>Question- {faq.question} </Text>
          <Text>Answer- {faq.answer}</Text>
        </View>
      ))}
      {user && user.role && user.role == "manager" ? (
        <View>
          {faqs.map((faq, i) => (
            <View key={i} style={{ paddingTop: 50, flexDirection: "row" }}>
              <Button title="Edit" onPress={() => handleEdit(faq)} />

              <Button title="X" onPress={() => handleDelete(faq)} />
            </View>
          ))}

          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setQuestion}
            placeholder="Question"
            value={question}
          />
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setAnswer}
            placeholder="Answer"
            value={answer}
          />

          <Button title="Send" onPress={handleSend} />

          <Button title="Send" onPress={handleSend} />
        </View>
      ) : (
        <Button
          color="green"
          title="Back"
          onPress={() => props.navigation.goBack()}
        ></Button>
      )}
    </View>
  );
};

FAQ.navigationOptions = {
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
        MyProfile
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
export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 200,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1,
  },
  pickerItem: {
    color: "red",
  },
});
