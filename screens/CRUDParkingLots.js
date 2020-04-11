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
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

//import { handleParkings } from "../functions";
const handleParkingLot = firebase.functions().httpsCallable("handleParkingLot");

const CRUDParkingLots = (props) => {
  const [parkingLots, setParkingLot] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] = useState();

  useEffect(() => {
    db.collection("ParkingLots").onSnapshot((querySnapshot) => {
      const parkingLots = [];
      querySnapshot.forEach((doc) => {
        parkingLots.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current parkingLots: ", parkingLots);
      setParkingLot([...parkingLots]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleParkingLot({
        parkingLot: {
          id,
          name,
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
        },
        operation: "update",
      });
    } else {
      // call serverless function instead
      const response2 = await handleParkingLot({
        parkingLot: {
          name,
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
        },
        operation: "add",
      });
    }
    setName("");
    setLongitude(0);
    setLatitude(0);
    setId("");
  };

  const handleEdit = (parkingLot) => {
    // console.log("ppppppppppppppppppp", parkingLot);
    setName(parkingLot.name);
    setLatitude(parkingLot.latitude);
    setLongitude(parkingLot.longitude);
    setId(parkingLot.id);
    setSelectedParkingLot(parkingLot);
    // console.log("ppppppppppppppppppp", latitude, "-", longitude);
  };
  const handleDelete = async (parkingLot) => {
    const response2 = await handleParkingLot({
      parkingLot: parkingLot,
      operation: "delete",
    });
  };

  const handleEditModal = (parkingLot) => {
    handleEdit(parkingLot);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setName("");
    setLongitude(0);
    setLatitude(0);
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
                  <View style={{ alignItems: "flex-start", width: "80%" }}>
                    <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                      Name:
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
                    onChangeText={setLatitude}
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
                        onPress={() => handleDelete(selectedParkingLot)}
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
            </View>
          </Modal>
          {parkingLots.map((parkingLot, i) => (
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
                  <Text> {parkingLot.name}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Latitude:</Text>
                  <Text> {parkingLot.latitude}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Longitude:</Text>
                  <Text> {parkingLot.longitude}</Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 100 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  onPress={() => handleEditModal(parkingLot)}
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
            <Text style={{ color: "white" }}>Create New Parking Lot</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

CRUDParkingLots.navigationOptions = {
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
export default CRUDParkingLots;

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
