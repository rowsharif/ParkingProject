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
  Picker,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { createNativeWrapper } from "react-native-gesture-handler";
console.disableYellowBox = true;

const handleEmployee = firebase.functions().httpsCallable("handleEmployee");

const CRUDEmployees = (props) => {
  const [employees, setEmployees] = useState([]);
  const [crews, setCrews] = useState([]);
  const [crew, setCrew] = useState("");
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
  const [services, setServices] = useState([]);
  // const [crewName,setCrewName]=useState()

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();

  useEffect(() => {
    db.collection("Services").onSnapshot((querySnapshot) => {
      const services = [];
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current services: ", services);
      setServices([...services]);
    });
  }, []);
  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        const ParkingLots = [];
        let allCrews = [];
        let allEmployees = [];
        querySnapshot.forEach((doc) => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot((querySnapshot) => {
              const ncrews = [];
              allCrews = allCrews.filter((p) => p.fk !== doc.id);
              querySnapshot.forEach((docP) => {
                ncrews.push({ fk: doc.id, id: docP.id, ...docP.data() });

                db.collection("ParkingLots")
                  .doc(doc.id)
                  .collection("Crew")
                  .doc(docP.id)
                  .collection("Employee")
                  .onSnapshot((querySnapshot) => {
                    const nemployees = [];
                    allEmployees = allEmployees.filter((p) => p.fk !== docP.id);
                    querySnapshot.forEach((docE) => {
                      nemployees.push({
                        fkp: doc.id,
                        fk: docP.id,
                        crewName: docP.data().name,
                        id: docE.id,
                        ...docE.data(),
                      });
                    });
                    allEmployees = [...allEmployees, ...nemployees];
                    setEmployees([...allEmployees]);
                  });
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
              console.log("Crews", allCrews);
            });
        });
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      if (crew === fk) {
        const response2 = await handleEmployee({
          employee: { id, type, name, identifier, fk, fkp },
          operation: "update",
        });
      } else {
        const response2 = await handleEmployee({
          employee: { id, type, name, identifier, fk, fkp },
          operation: "delete",
        });
        const response3 = await handleEmployee({
          employee: {
            type,
            name,
            identifier,
            fk: crew,
            fkp: crews.filter((c) => c.id === crew)[0].fk,
          },
          operation: "add",
        });
      }
    } else {
      // call serverless function instead
      const response2 = await handleEmployee({
        employee: {
          type,
          name,
          identifier,
          fk: crew,
          fkp: crews.filter((c) => c.id === crew)[0].fk,
        },
        operation: "add",
      });
    }
    setType("");
    setName("");
    setId("");
    setIdentifier("");
    setCrew("");
  };

  const handleEdit = (employee) => {
    setType(employee.type);
    setName(employee.name);
    setIdentifier(employee.identifier);
    setFk(employee.fk);
    setFkp(employee.fkp);
    setId(employee.id);
    setCrew(crews.filter((c) => c.id === employee.fk)[0]);
    setCrew(employee.fk);
  };
  const handleDelete = async (employee) => {
    const response2 = await handleEmployee({
      employee: employee,
      operation: "delete",
    });
  };

  const handleEditModal = (employee) => {
    handleEdit(employee);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setType("");
    setName("");
    setId("");
    setIdentifier("");
    setCrew("");
    setCreate(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
            // key={news.id}
          >
            <View
              style={{
                margin: "5%",
                backgroundColor: "#c7c7c7",
                height: "80%",
                borderRadius: 10,
                ...Platform.select({
                  ios: {
                    marginTop: "15%",
                  },
                  android: {
                    marginTop: "15%",
                  },
                }),
              }}
            >
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                style={{ textAlign: "center" }}
              >
                <View style={{ alignItems: "flex-end", margin: 10 }}>
                  <FontAwesome
                    name="close"
                    size={22}
                    color="black"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </Animatable.View>

              <View
                style={{ alignItems: "center", height: "100%", width: "100%" }}
              >
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Employee Identifier:
                  </Text>
                </View>
                <TextInput
                  style={{
                    paddingLeft: 5,
                    margin: 5,
                    width: 300,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    backgroundColor: "white",
                  }}
                  onChangeText={setIdentifier}
                  placeholder="Identifier"
                  value={identifier}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Employee Name:
                  </Text>
                </View>
                <TextInput
                  style={{
                    paddingLeft: 5,
                    margin: 5,
                    width: 300,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    backgroundColor: "white",
                  }}
                  onChangeText={setName}
                  placeholder="Name"
                  value={name}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Crew Name:
                  </Text>
                </View>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={crew}
                  onValueChange={(itemValue) => setCrew(itemValue)}
                >
                  <Picker.Item label={"select"} value={"select"} />
                  {crews.map((crew, i) => (
                    <Picker.Item label={crew.name} value={crew.id} />
                  ))}
                </Picker>

                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Service:
                  </Text>
                </View>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={type}
                  onValueChange={(itemValue) => setType(itemValue)}
                >
                  <Picker.Item label={"select"} value={"select"} />
                  {services.map((service, i) => (
                    <Picker.Item label={service.name} value={service.name} />
                  ))}
                </Picker>

                {create ? (
                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                      flexDirection: "row",
                      marginTop: "10%",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleSend()}
                      style={{
                        width: "30%",
                        backgroundColor: "#5dba68",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Create</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                      flexDirection: "row",
                      marginTop: "10%",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDelete(selectedEmployee)}
                      style={{
                        width: "30%",
                        backgroundColor: "#eb5a50",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleSend()}
                      style={{
                        width: "30%",
                        backgroundColor: "#5dba68",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
          {employees.map((employee, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#c7c7c7",
                borderRadius: 5,
                justifyContent: "center",
                margin: 10,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "80%",
                  paddingLeft: 10,
                  justifyContent: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Identifier:</Text>
                  <Text> {employee.identifier}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Employee Name:</Text>
                  <Text style={{ width: "85%" }}> {employee.name}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Crew Name:</Text>
                  <Text> {employee.crewName}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Service:</Text>
                  <Text> {employee.type}</Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 120 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  onPress={() => handleEditModal(employee)}
                  style={{
                    backgroundColor: "#276b9c",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{ height: 100 }}>
            {/* Empty to View to fix scrolling height issue */}
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            onPress={() => handleCreate()}
            style={{
              backgroundColor: "#75213d",
              width: "100%",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              // borderTopRightRadius: 5,
              // borderBottomRightRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Create New Employee</Text>
          </TouchableOpacity>
          {/* <Button
            title="Create New Newsletter"
            onPress={() => handleCreate()}
          ></Button> */}
          {/* <Button  title="Send" onPress={handleSend} />
        <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button> */}
        </View>
      </ImageBackground>
    </View>
  );
};
CRUDEmployees.navigationOptions = {
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
export default CRUDEmployees;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 300,
    height: 40,
    ...Platform.select({
      ios: {
        marginBottom: "40%",
      },
      android: {
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
      },
    }),
    margin: 5,
    paddingLeft: 5,
  },
  pickerItem: {
    color: "red",
  },
});
