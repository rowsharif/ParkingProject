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

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

console.disableYellowBox = true;

const handleCrew = firebase.functions().httpsCallable("handleCrew");

const CRUDCrew = (props) => {
  //crews objects as an array to save all the crews we get from the database to display them
  const [crews, setCrews] = useState([]);
  const [parking, setParking] = useState([]);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [fkp, setFkp] = useState();
  const [pname, setPname] = useState("");
  const [pnames, setPnames] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState();

  useEffect(() => {
    //getting all Crews and all ParkingLots
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        const ParkingLots = [];
        let allCrews = [];
        querySnapshot.forEach((doc) => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot((querySnapshot) => {
              const ncrews = [];
              allCrews = allCrews.filter((p) => p.fkp !== doc.id);
              querySnapshot.forEach((docP) => {
                ncrews.push({
                  fkp: doc.id,
                  pln: doc.data().name,
                  id: docP.id,
                  ...docP.data(),
                });
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
              // console.log("Crews", allCrews);
              // console.log("Pnames",pnames.name)
              setPnames([...ParkingLots]);
            });
        });
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      if (fkp === pname) {
        const response2 = await handleCrew({
          crew: { id, name, fkp },
          operation: "update",
        });
      } else {
        const response2 = await handleCrew({
          crew: { id, name, fkp },
          operation: "delete",
        });
        const response3 = await handleCrew({
          crew: { name, fkp: pname },
          operation: "add",
        });
      }
    } else {
      // call serverless function instead
      const response2 = await handleCrew({
        crew: { name, fkp: pname },
        operation: "add",
      });
    }

    setName("");
    setPname("");
    setId("");
  };

  const handleEdit = (crew) => {
    setName(crew.name);
    setFkp(crew.fkp);
    setPname(crew.fkp);
    setId(crew.id);
  };
  //if the user choose to delete the crew the function will be called
  const handleDelete = async (crew) => {
    //it sends the crew to delete as a parameter to the function and the operation as "delete"
    const response2 = await handleCrew({
      crew: {id, name, fkp},
      operation: "delete",
    });
  };
  const handleEditModal = (crew) => {
    handleEdit(crew);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setName("");
    setPname("");
    setId("");
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
                    Crew Name:
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
                    Parking Lot:
                  </Text>
                </View>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={pname}
                  onValueChange={(itemValue) => setPname(itemValue)}
                >
                  {pnames.map((pname, i) => (
                    <Picker.Item label={pname.name} value={pname.id} />
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
                      onPress={() => handleDelete()}
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
          {crews.map((crew, i) => (
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
                  <Text style={{ fontWeight: "bold" }}>Name:</Text>
                  <Text> {crew.name}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Parking Lot:</Text>
                  <Text> {crew.pln}</Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 100 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  onPress={() => handleEditModal(crew)}
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
            <Text style={{ color: "white" }}>Create New Crew</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
CRUDCrew.navigationOptions = {
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
export default CRUDCrew;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: 'center',
    // justifyContent: "center",
  },
  picker: {
    width: 300,
    height: 40,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    paddingLeft: 5,
  },
  pickerItem: {
    color: "red",
  },
});
