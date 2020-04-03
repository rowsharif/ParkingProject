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
  Picker
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { createNativeWrapper } from "react-native-gesture-handler";
const handleEmployee = firebase.functions().httpsCallable("handleEmployee");

const CRUDEmployee = props => {
  const [employees, setEmployees] = useState([]);
  const [Crews, setCrews] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("+974");
  const [email, setemail] = useState("");
  const [parking, setParking] = useState([]);
  const [type, setType] = React.useState("");
  const [id, setId] = React.useState("");
  const [uid, setuid] = useState();
  const [crew, setCrew] = useState([]);

 

  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then(querySnapshot => {
        const ParkingLots = [];
        let allCrews = [];
        let allEmployees = [];
        querySnapshot.forEach(doc => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot(querySnapshot => {
              const ncrews = [];
              allCrews = allCrews.filter(p => p.fk !== doc.id);
              querySnapshot.forEach(docP => {
                ncrews.push({ fk: doc.id, id: docP.id, ...docP.data() });

                db.collection("ParkingLots")
                  .doc(doc.id)
                  .collection("Crew")
                  .doc(docP.id)
                  .collection("Employee")
                  .onSnapshot(querySnapshot => {
                    const nemployees = [];
                    allEmployees = allEmployees.filter(p => p.fk !== docP.id);
                    querySnapshot.forEach(docE => {
                      nemployees.push({
                        fk: docP.id,
                        crewName: docP.name,
                        id: docE.id,
                        ...docE.data()
                      });
                    });
                    allEmployees = [...allEmployees, ...nemployees];
                    setEmployees([...allEmployees]);
                  });
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
            });
        });
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleEmployee({
        employee: { id, type },
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleEmployee({
        employee: { type },
        operation: "add"
      });
    }
    setType("");

    setId("");
   
  };

  const handleEdit = employee => {
    setType(employee.type);

    setId(employee.id);
  };
  const handleDelete = async employee => {
    const response2 = await handleEmployee({
      employee: employee,
      operation: "delete"
    });
  };
  return (
    <ScrollView style={styles.container}>
      
      {employees.map((employee, i) => (
        <View style={{ paddingTop: 50, flexDirection: "row" }}>
          <Text style={styles.getStartedText}>
            {employee.type} - crew Name:{employee.crewName}
          </Text>
          <Button title="Edit" onPress={() => handleEdit(employee)} />
          <Button title="X" onPress={() => handleDelete(employee)} />
        </View>
      ))}
      {/* <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      /> */}

      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={crew}
        onValueChange={itemValue => setCrew([...crew])}
      >
        {Crews.map((crew, i) => (
            <Text style={styles.getStartedText}>
              <Picker.Item label={crew.name} value={crew.name} />
            </Text>
          
        ))}
      </Picker>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          fontSize: 24,
          margin: "2%"
        }}
        onChangeText={setType}
        placeholder="Type"
        value={type}
      />
      <Button title="Send" onPress={handleSend} />
      <Button
        color="green"
        title="Back"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </ScrollView>
  );
};
CRUDEmployee.navigationOptions = {
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
        MyProfile
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
export default CRUDEmployee;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: "center",
    // justifyContent: "center"
  },
  picker: {
    width: 200,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1
  },
  pickerItem: {
    color: "red"
  }
});
