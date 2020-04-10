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
console.disableYellowBox = true;

// const handlePayments = firebase.functions().httpsCallable("handlePayment");

const CRUDPayments = (props) => {
  const [Payments, setPayments] = useState([]);
  const [car, setCar] = useState([]);

  useEffect(() => {
    db.collection("Payment").onSnapshot((querySnapshot) => {
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      setPayments([...payments]);
    });
  }, []);

  return (
    <ScrollView>
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
        Users payment{" "}
      </Text>
      {Payments.map((payment, i) => (
        <View key={i} style={{ borderColor: "gray", borderWidth: 1 }}>
          <Text>Car PlateNumber - {payment.Car.PlateNumber}</Text>
          <Text>Parking Lot - {payment.Parking.name}</Text>
          <Text>
            Date - {payment.DateTime.toDate().getDate()}-
            {payment.DateTime.toDate().getMonth()}-
            {payment.DateTime.toDate().getFullYear()}
          </Text>
          <Text>
            Time - {payment.DateTime.toDate().getHours()}:
            {payment.DateTime.toDate().getMinutes()}
          </Text>
          <Text>Services: </Text>
          {payment.ServicesIds &&
            payment.ServicesIds.map((service) => (
              <Text style={{ paddingLeft: 15 }}>
                {service.name} - {service.price}
              </Text>
            ))}
          <Text>
            Duration -{" "}
            {payment.Duration >= 0 ? payment.Duration : "Car still in campus"}
          </Text>
          <Text>Promotion - %{payment.promotion}</Text>
          <Text>
            Total Amount -{" "}
            {payment.TotalAmount >= 0 ? (
              <Text>
                {payment.TotalAmount}
                {"  "}
                {payment.promotion > 0 && (
                  <Text
                    style={{
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                      color: "gray",
                    }}
                  >
                    {payment.TotalAmount / (1 - payment.promotion / 100)}
                  </Text>
                )}
              </Text>
            ) : (
              "_"
            )}
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
CRUDPayments.navigationOptions = {
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
export default CRUDPayments;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
