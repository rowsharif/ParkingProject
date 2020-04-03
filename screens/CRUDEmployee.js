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

const CRUDEmployees = props => {
  const [employees, setEmployees] = useState([]);
  const [crews, setCrews] = useState([]);
  const [crew, setCrew] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("+974");
  const [email, setemail] = useState("");
  const [parking, setParking] = useState([]);
  const [type, setType] = React.useState("");
  const [name, setName] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");
  const [id, setId] = React.useState("");
  const [fkp, setFkp] = useState();
  const [fk, setFk] = useState();

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
                        fkp: doc.id,
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
              console.log("Crews", Crews);
            });
        });
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      if (crew.id === fk) {
        const response2 = await handleEmployee({
          employee: { id, type, name, identifier, fk, fkp },
          operation: "update"
        });
      } else {
        const response2 = await handleEmployee({
          employee: { id, type, name, identifier, fk, fkp },
          operation: "delete"
        });
        const response3 = await handleEmployee({
          employee: { type, name, identifier, fk: crew.id, fkp: crew.fk },
          operation: "add"
        });
      }
    } else {
      // call serverless function instead
      const response2 = await handleEmployee({
        employee: { type, name, identifier, fk: crew.id, fkp: crew.fk },
        operation: "add"
      });
    }
    setType("");
    setName("");
    setId("");
    setIdentifier("");
  };

  const handleEdit = employee => {
    setType(employee.type);
    setName(employee.name);
    setIdentifier(employee.identifier);
    setFk(employee.fk);
    setFkp(employee.fkp);
    setId(employee.id);
  };
  const handleDelete = async employee => {
    const response2 = await handleEmployee({
      employee: employee,
      operation: "delete"
    });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        {employees.map((employee, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {employee.identifier} - {employee.name} - {employee.type} - crew
              Name:{employee.crewName}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(employee)} />
            <Button title="X" onPress={() => handleDelete(employee)} />
          </View>
        ))}
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setIdentifier}
          placeholder="Identifier"
          value={identifier}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setType}
          placeholder="Type"
          value={type}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setName}
          placeholder="Name"
          value={name}
        />

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={crew}
          onValueChange={itemValue => setCrew(itemValue)}
        >
          {crews.map((crew, i) => (
            <Picker.Item label={crew.name} value={crew.name} />
          ))}
        </Picker>

        <Button title="Send" onPress={handleSend} />
        <Button
          color="green"
          title="Back"
          onPress={() => props.navigation.goBack()}
        ></Button>
      </View>
    </ScrollView>
  );
};
CRUDEmployees.navigationOptions = {
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
export default CRUDEmployees;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center"
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
