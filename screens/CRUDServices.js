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
import * as Animatable from "react-native-animatable";
import { FontAwesome, Octicons } from "@expo/vector-icons";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleServices = firebase.functions().httpsCallable("handleServices");

const CRUDServices = (props) => {
  const [services, setServices] = useState([]);
  const [price, setPrice] = React.useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [delete1, setDelete1] = useState(false);


  useEffect(() => {

    db.collection("Services").onSnapshot((querySnapshot) => {
      //////services is an empty,temporary array within the query

      const services = [];
      /////this empty array will get each object from the Services collection in the database by pushing the id and all other data from the database through the loop
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });

      console.log(" Current services: ", services);

      setServices([...services]);
    });
  }, []);


  const handleSend = async () => {

    if (id) {
      const response2 = await handleServices({
        //// sends the service object
        service: { id, name, price },
        operation: "update",
      });
    }
    else {
      const response2 = await handleServices({
        service: { name, price },

        operation: "add",
      });
    }
    setName("");
    setPrice("");
    setId("");
  };
  const handleEdit = (service) => {
    setName(service.name);

    setPrice(service.price);

    setId(service.id);
  };

  const handleDelete = async () => {
    const response2 = await handleServices({
      service: {id,name,price},
      operation: "delete",
    });
    setName("");
    setPrice("");
    setId("");
  };


  const handleDeleteModal = (service) => {
    handleDelete(service);
    setDelete1(false);
    setModalVisible(true);
  };

  const handleEditModal = (service) => {
    handleEdit(service);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setName("");
    setPrice("");
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
            <View>
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
                  style={{
                    alignItems: "center",
                    height: "75%",
                    width: "100%",
                  }}
                >
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
                    placeholder="Service Name"
                    value={name}
                  />
                  <View style={{ alignItems: "flex-start", width: "80%" }}>
                    <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                      Price:
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
                    onChangeText={setPrice}
                    placeholder="Service Price"
                    value={price + ""}
                  />
                </View>

                {create ? (
                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                      flexDirection: "row",
                      // marginTop: "10%",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleSend()}
                      style={{
                        width: "30%",
                        backgroundColor: "#5dba68",
                        padding: 5,
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
                      // marginTop: 0,
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

          {services.map((service, i) => (
            <View
              key={i}
              style={{
                // backgroundColor: "#c7c7c7",
                borderRadius: 5,
                justifyContent: "center",
                margin: 10,
                marginTop: 15,
                height: 100,
              }}
            >
              <View style={{ height: "75%", marginTop: 5 }}>
                <View
                  style={{
                    // backgroundColor: "red",
                    backgroundColor: "#c7c7c7",
                    borderRadius: 5,
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: "80%", justifyContent: "center" }}>
                    <Text
                      style={{
                        // backgroundColor: "blue",
                        paddingLeft: 18,
                        fontSize: 18,
                      }}
                    >
                      {service.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "20%",
                      justifyContent: "center",
                      height: "100%",
                      alignItems: "center",
                      backgroundColor: "#75213d",
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        // width: "20%",
                        // backgroundColor: "yellow",
                        // paddingLeft: 18,
                        fontSize: 18,
                        color: "white",
                      }}
                    >
                      QR {service.price}
                    </Text>
                  </View>
                </View>
                {/* <Text style={styles.getStartedText}>
                {service.name} - {service.price}
              </Text> */}

                {/* <Animatable.View
                animation="shake"
                iterationCount={3}
                style={{ textAlign: "center" }}
              >
                <Button title="Edit" onPress={() => handleEdit(service)} />
              </Animatable.View>

              <Animatable.View
                animation="shake"
                iterationCount={3}
                style={{ textAlign: "center" }}
              >
                <Button title="X" onPress={() => handleDelete(service)} />
              </Animatable.View> */}
              </View>
              <View style={{ height: "25%", marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => handleEditModal(service)}
                  style={{
                    backgroundColor: "#276b9c",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // borderTopRightRadius: 5,
                    // borderBottomRightRadius: 5,
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
            <Text style={{ color: "white" }}>Create New Service</Text>
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

CRUDServices.navigationOptions = {
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
export default CRUDServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 200,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1,
  },
  pickerItem: {
    color: "red",
  },
});
