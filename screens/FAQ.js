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
  Picker,
} from "react-native";
import * as Animatable from "react-native-animatable";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleFAQ = firebase.functions().httpsCallable("handleFAQ");

const FAQ = (props) => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [id, setId] = React.useState("");

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
      {faqs.map((faq, i) => (
        <View key={i} style={{ paddingTop: 50, flexDirection: "row" }}>
          <Text style={styles.getStartedText}>
            {faq.question} -{faq.answer}
          </Text>

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

      <Button
        color="green"
        title="Back"
        onPress={() => props.navigation.goBack()}
      ></Button>
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
