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

const handleCrew = firebase.functions().httpsCallable("handleCrew");

const EmployeeServices = (props) => {
  const [employee, setEmployee] = useState({});
  const [services, setServices] = useState([]);
  const [completedServices, setCompletedServices] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        let Employee = {};
        querySnapshot.forEach((doc) => {
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((docP) => {
                db.collection("ParkingLots")
                  .doc(doc.id)
                  .collection("Crew")
                  .doc(docP.id)
                  .collection("Employee")
                  .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((docE) => {
                      if (
                        docE.data().identifier ===
                        firebase.auth().currentUser.email.toString()
                      ) {
                        Employee = {
                          id: docE.id,
                          ...docE.data(),
                        };
                        setEmployee(Employee);
                        console.log("Employee", Employee);
                        db.collection("ParkingLots")
                          .doc(Employee.fkp)
                          .collection("Crew")
                          .doc(Employee.fk)
                          .collection("UserServices")
                          .onSnapshot((querySnapshot) => {
                            const services = [];
                            querySnapshot.forEach((doc) => {
                              services.push({
                                id: doc.id,
                                ...doc.data(),
                              });
                            });
                            setServices([
                              ...services.filter((s) => s.EmployeeId === ""),
                            ]);
                            setCompletedServices([
                              ...services.filter(
                                (s) => s.EmployeeId === Employee.id
                              ),
                            ]);
                          });
                      }
                    });
                  });
              });
            });
        });
      });
  }, []);
  const completeService = (service) => {
    let s = service;
    s.EmployeeId = employee.id;
    db.collection("ParkingLots")
      .doc(employee.fkp)
      .collection("Crew")
      .doc(employee.fk)
      .collection("UserServices")
      .doc(service.id)
      .update(s);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <View
          style={{
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
          <TouchableOpacity
            style={{
              width: "40%",
              height: "100%",
              borderWidth: 3,
              justifyContent: "center",
              backgroundColor: "#75213d",
              alignItems: "center",
            }}
            onPress={() => setCompleted(false)}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                height: "60%",
                color: "white",
              }}
            >
              {services.length}
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
              Incomplete Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "40%",
              height: "100%",
              justifyContent: "center",
              backgroundColor: "#75213d",
              alignItems: "center",
              borderWidth: 3,
            }}
            onPress={() => setCompleted(true)}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                height: "60%",
                color: "white",
              }}
            >
              {completedServices.length}
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
              Completed Services
            </Text>
          </TouchableOpacity>
          {/* <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Users history{" "}
          </Text> */}
        </View>
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
          {completed
            ? completedServices.map((service, i) => (
                <View
                  key={i}
                  style={{
                    borderColor: "black",
                    borderTopWidth: 1,
                    backgroundColor: "lightgray",
                    padding: "3%",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: "80%", height: "100%" }}>
                    <Text>Car Plate: {service.Car}</Text>
                    <Text>Service: {service.ServiceName}</Text>
                  </View>
                </View>
              ))
            : services.map(
                (service, i) =>
                  service.ServiceName === employee.type && (
                    <View
                      key={i}
                      style={{
                        borderColor: "black",
                        borderTopWidth: 1,
                        backgroundColor: "lightgray",
                        padding: "3%",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "100%", height: "100%" }}>
                        <Text>Car Plate: {service.Car}</Text>
                        <Text>Service: {service.ServiceName}</Text>
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#276b9c",
                              width: "100%",
                              marginTop: 5,
                              alignItems: "center",
                              justifyContent: "center",
                              height: 25,
                              borderRadius: 5,
                            }}
                            onPress={() => completeService(service)}
                          >
                            <Text
                              style={{ textAlign: "center", color: "white" }}
                            >
                              Complete Service
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )
              )}

          {/* {completed ? (
            <View
              style={{
                borderColor: "black",
                borderTopWidth: 1,
                backgroundColor: "lightgray",
                padding: "3%",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "100%", height: "100%" }}>
                <Text>Car Plate:</Text>
                <Text>Service: </Text>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#276b9c",
                      width: "100%",
                      marginTop: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 25,
                      borderRadius: 5,
                    }}
                    onPress={() => completeService(service)}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      Complete Service
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                borderColor: "black",
                borderTopWidth: 1,
                backgroundColor: "lightgray",
                padding: "3%",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "80%", height: "100%" }}>
                <Text>Car Plate:</Text>
                <Text>Service: </Text>
              </View>
            </View>
          )} */}

          {/* <Button
            color="green"
            title="Cancel"
            onPress={() => props.navigation.goBack()}
          ></Button> */}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
EmployeeServices.navigationOptions = {
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
export default EmployeeServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: 'center',
    // justifyContent: "center",
  },
});
