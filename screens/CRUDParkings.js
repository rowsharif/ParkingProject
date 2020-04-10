import * as WebBrowser from "expo-web-browser";
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
import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleCRUDParkings = firebase
  .functions()
  .httpsCallable("handleCRUDParkings");

const CRUDParkings = (props) => {
  const [parkings, setParkings] = useState([]);
  // console.log("---dddd-", parkings);
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setlatitude] = React.useState(0);
  const [amountperhour, setAmountperhour] = React.useState(0);
  const [type, setType] = React.useState("");
  const [id, setId] = React.useState("");
  const [ParkingLot, setParkingLot] = useState("");
  const [ParkingLots, setParkingLots] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedParking, setSelectedParking] = useState();

  // useEffect(() => {
  //   db.collection("Parkings").onSnapshot(querySnapshot => {
  //     const parkings = [];
  //     console.log("----",parkings)
  //     querySnapshot.forEach(doc => {
  //       parkings.push({ id: doc.id, ...doc.data() });

  //     });
  //     console.log(" Current parkings: ", parkings);
  //     setParkings([...parkings]);
  //   });
  // }, []);
  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        const ParkingLots = [];
        let allParkings = [];
        querySnapshot.forEach((doc) => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Parkings")
            .onSnapshot((querySnapshot) => {
              const nparkings = [];
              allParkings = allParkings.filter((p) => p.fk !== doc.id);
              querySnapshot.forEach((docP) => {
                nparkings.push({ fk: doc.id, id: docP.id, ...docP.data() });
              });
              allParkings = [...allParkings, ...nparkings];
              setParkings([...allParkings]);
            });
        });
        setParkingLots([...ParkingLots]);
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleCRUDParkings({
        parking: {
          id,
          fk: ParkingLot,
          longitude: parseInt(longitude),
          latitude: parseInt(latitude),
          amountperhour: parseInt(amountperhour),
          type,
        },
        operation: "update",
      });
    } else {
      const response2 = await handleCRUDParkings({
        parking: {
          fk: ParkingLot,
          longitude: parseInt(longitude),
          latitude: parseInt(latitude),
          amountperhour: parseInt(amountperhour),
          type,
        },
        operation: "add",
      });
    }
    setLongitude(0);
    setlatitude(0);
    setAmountperhour(0);
    setType("");
    setId("");
    setParkingLot("");
  };

  const handleEdit = (parking) => {
    setlatitude(parking.latitude);
    setLongitude(parking.longitude);
    setAmountperhour(parking.amountperhour);
    setType(parking.type);
    setId(parking.id);
    setParkingLot(parking.fk);
    setSelectedParking(parking);
  };
  const handleDelete = async (parking) => {
    const response2 = await handleCRUDParkings({
      parking: parking,
      operation: "delete",
    });
  };

  const handleEditModal = (parking) => {
    handleEdit(parking);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setLongitude(0);
    setlatitude(0);
    setAmountperhour(0);
    setType("");
    setId("");
    setParkingLot("");
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
                    Parking Lot:
                  </Text>
                </View>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={ParkingLot}
                  onValueChange={(itemValue) => setParkingLot(itemValue)}
                >
                  {ParkingLots.map((ParkingLot, i) => (
                    <Picker.Item
                      label={ParkingLot.name}
                      value={ParkingLot.id}
                    />
                  ))}
                </Picker>
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Type:
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
                  onChangeText={setType}
                  placeholder="Type"
                  value={type}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Amount:
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
                  onChangeText={setAmountperhour}
                  placeholder="Amount per hour"
                  value={`${amountperhour}`}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Latitude:
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
                  onChangeText={setlatitude}
                  placeholder="Latitude"
                  value={latitude + ""}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Longitude:
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
                  onChangeText={setLongitude}
                  placeholder="Longitude"
                  value={longitude + ""}
                />
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
                      onPress={() => handleDelete(selectedParking)}
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
          {parkings.map((parking, i) => (
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
                  <Text style={{ fontWeight: "bold" }}>Type:</Text>
                  <Text> {parking.type}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Latitude:</Text>
                  <Text> {parking.latitude}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Longitude:</Text>
                  <Text> {parking.longitude}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Amount per Hour:</Text>
                  <Text> {parking.amountperhour}</Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 100 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  onPress={() => handleEditModal(parking)}
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
            <Text style={{ color: "white" }}>Create New Parking</Text>
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

CRUDParkings.navigationOptions = {
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
export default CRUDParkings;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //alignItems: 'center',
    //justifyContent: "center",
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
