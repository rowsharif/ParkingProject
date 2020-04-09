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
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
// const handlehistories = firebase.functions().httpsCallable("handleHistory");

const CRUDhistories = (props) => {
  const [histories, sethistories] = useState([]);

  

  useEffect(() => {
    db.collection("History").onSnapshot((querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      sethistories([...history]);
    });
  }, []);

  return (
    <ScrollView>
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
        Users history{" "}
      </Text>
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
        Cars parked in campus:{" "}
        {histories.filter((history) => !(history.Duration >= 0)).length}
      </Text>
      <Text>Number of histories of users: {histories.length}</Text>

      {histories.map((history, i) => (
        <View key={i} style={{ borderColor: "gray", borderWidth: 1 }}>
          <Text>
            Total Amount - {history.TotalAmount > 0 ? history.TotalAmount : "_"}
          </Text>
          <Text>
            Date - {history.DateTime.toDate().getDate()}-
            {history.DateTime.toDate().getMonth()}-
            {history.DateTime.toDate().getFullYear()}
          </Text>
          <Text>
            Time - {history.DateTime.toDate().getHours()}:
            {history.DateTime.toDate().getMinutes()}
          </Text>
          <Text>
            Duration -{" "}
            {history.Duration >= 0 ? history.Duration : "Car still in campus"}
          </Text>
        </View>
      ))}

      <Button
        color="green"
        title="Cancel"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </ScrollView>
  );
};
CRUDhistories.navigationOptions = {
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
export default CRUDhistories;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
