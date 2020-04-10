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
    <ScrollView style={styles.container}>
      <View style={{ paddingTop: 50, flexDirection: "row" }}>
        <Text style={styles.getStartedText}>
          Name: {employee.name} - Type: {employee.type} - Email:{" "}
          {employee.identifier}
        </Text>
      </View>
      {completed
        ? completedServices.map((service, i) => (
            <View
              key={i}
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: "row",
                borderColor: "gray",
                borderWidth: 1,
              }}
            >
              <Text key={i} style={styles.getStartedText}>
                Car Plate: {service.Car} - Service: {service.ServiceName}
              </Text>
            </View>
          ))
        : services.map(
            (service, i) =>
              service.ServiceName === employee.type && (
                <View
                  key={i}
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    flexDirection: "row",
                    borderColor: "gray",
                    borderWidth: 1,
                  }}
                >
                  <Text key={i} style={styles.getStartedText}>
                    Car Plate: {service.Car} - Service: {service.ServiceName}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      textAlign: "center",
                      borderColor: "blue",
                      backgroundColor: "#d6fffc",
                      width: "20%",
                      margin: "1%",
                      padding: "1%",
                    }}
                    onPress={() => completeService(service)}
                  >
                    <Text style={styles.buttonText}> Complete </Text>
                  </TouchableOpacity>
                </View>
              )
          )}

      <View style={{ width: "100%", flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            textAlign: "center",
            borderColor: "blue",
            backgroundColor: "#d6fffc",
            width: "47%",
            margin: "1%",
            padding: "3%",
          }}
          onPress={() => setCompleted(false)}
        >
          <Text style={styles.buttonText}> Services to Complete </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            textAlign: "center",
            borderColor: "blue",
            backgroundColor: "#d6fffc",
            width: "47%",
            margin: "1%",
            padding: "3%",
          }}
          onPress={() => setCompleted(true)}
        >
          <Text style={styles.buttonText}>Completed Services</Text>
        </TouchableOpacity>
      </View>
      <Button
        color="green"
        title="Back"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </ScrollView>
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
