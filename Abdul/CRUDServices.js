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
////calls the handleServices method from the firebase functions folder,index.js file
/// httpsCallable is a reference to a "callable" http actions in firebase Functions.
const handleServices = firebase.functions().httpsCallable("handleServices");

const CRUDServices = (props) => {
  //////////usestate hook that allows to have state variables in a functional component.
  //////////created an array of services and set it to empty array as an initial value
  const [services, setServices] = useState([]);
  ////////created a price variable and set the initial value of the price as 0
  const [price, setPrice] = React.useState(0);
  ////created name component and set the initial value as an empty string
  const [name, setName] = React.useState("");
  ///created id component and set the initial value as an empty string.
  const [id, setId] = React.useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);

  ////////useEffect hook is used to perform an action to the components after rendering
  useEffect(() => {
    //// The query below gets the Services collection from the firebase database

    db.collection("Services").onSnapshot((querySnapshot) => {
      //////services is an empty,temporary array within the query

      const services = [];
      /////this empty array will get each object from the Services collection in the database by pushing the id and all other data from the database through the loop
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });
      ///// the temporary array will now be carrying objects of Services collections

      console.log(" Current services: ", services);
      //// the useState setservices array will then recieve all the temporary services objects using setServices by filling all the rendered objects

      setServices([...services]);
    });
  }, []);

  /////handleSend method calls the method from functions folder, index.js file(firebase function)

  const handleSend = async () => {
    ///// it checks if there is an id sent,

    if (id) {
      ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return
      const response2 = await handleServices({
        //// sends the service object
        service: { id, name, price },
        ////and finally returns an update operation to check the update query from the method in the firebase function folder
        operation: "update",
      });
    }
    ////else if there isnt any id sent
    else {
      ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return
      const response2 = await handleServices({
        //// creates a new service object
        service: { name, price },

        ////and finally returns the add operation to check the add query from the method in the firebase function folder
        operation: "add",
      });
    }
    /// then it sets back the input value to empty string
    setName("");
    setPrice("");
    setId("");
  };
  ///////handleEdit gets the object entered in the textinput and sends back the new name,price and id of the the new editted object to the useState
  const handleEdit = (service) => {
    ///sets the original, before edit name value to the useState
    setName(service.name);

    ///sets the original, before edit price value to the useState
    setPrice(service.price);

    ///sets the original, before edit id value to the useState
    setId(service.id);
  };

  ////////handleDelete method gets the object and deletes the object using the firebase function created in index.js.
  const handleDelete = async (service) => {
    ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return

    const response2 = await handleServices({
      ///the service object is recognized
      service: service,
      ////and finally returns the delete operation to check the add query from the method in the firebase function folder
      operation: "delete",
    });
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
                      onPress={() => handleDelete(service)}
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
