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
  Modal,
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const CRUDhistories = (props) => {
  const [histories, sethistories] = useState([]);
  const [DateTime, setDateTime] = React.useState();
  const [Duration, setDuration] = React.useState(0);
  const [TotalAmount, setTotalAmount] = React.useState(0);
  const [id, setId] = React.useState("");
  const [car, setCar] = useState([]);

  useEffect(() => {
    db.collection("History")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const history = [];
        querySnapshot.forEach((doc) => {
          history.push({ id: doc.id, ...doc.data() });
        });
        console.log("history", history);
        sethistories([...history]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
            paddingTop: 10,
            paddingLeft: 10,
          }}
        >
          {" "}
          My History{" "}
        </Text>
        <View
          style={{
            marginTop: 15,
            backgroundColor: "lightgray",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "25%",
            marginLeft: "5%",
            marginRight: "5%",
            flexDirection: "row",
            paddingTop: "3%",
            paddingBottom: "2%",
          }}
        >
          <View
            style={{
              width: "40%",
              height: "100%",
              borderWidth: 3,
              justifyContent: "center",
              backgroundColor: "#75213d",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                height: "60%",
                color: "white",
              }}
            >
              {/* {histories.filter((history) => !(history.Duration >= 0)).length} */}
              {histories.length}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                height: "30%",
                color: "white",
                width: "70%",
              }}
            >
              Total No. of History Records
            </Text>
          </View>

          {/* <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Users history{" "}
          </Text> */}
        </View>
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
          {histories.map((history, i) => (
            <View
              key={i}
              style={{
                borderColor: "black",
                borderTopWidth: 1,
                backgroundColor: "lightgray",
                padding: "1%",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "80%", height: "100%" }}>
                <Text style={{ PaddingBottom: 10 }}>
                  Total Amount -{" "}
                  {history.TotalAmount >= 0 ? history.TotalAmount : "_"}
                </Text>
                <Text>Car PlateNumber - {history.Car.PlateNumber}</Text>
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
                  {history.Duration >= 0
                    ? history.Duration
                    : "Car still in campus"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
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
