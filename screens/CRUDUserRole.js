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
import { setWorldAlignment } from "expo/build/AR";
console.disableYellowBox = true;

const handleRole = firebase.functions().httpsCallable("handleRole");

const CRUDUserRole = (props) => {
  const [users, setusers] = useState([]);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [eid, seteid] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  // const [create, setCreate] = useState(false);
  // const [selectedRole, setSelectedRole] = useState();
  useEffect(() => {
    db.collection("users").onSnapshot((querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        user.push({ id: doc.id, ...doc.data() });
      });
      setusers([...user]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleRole({
        user: {
          id,
          role,
          eid,
        },
        operation: "update",
      });
    }

    setId("");
    setRole("");

    seteid("");
    setModalVisible(false);
  };

  const handleEdit = (user) => {
    setId(user.id);
    setRole(user.role);
    seteid(user.eid);
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
                    E-mail:
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
                  onChangeText={seteid}
                  placeholder="E-mail"
                  value={eid}
                  editable={false}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    User Role:
                  </Text>
                </View>

                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                >
                  <Picker.Item label="Employee" value="employee" />
                  <Picker.Item label="Admin" value="admin" />
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Staff" value="staff" />
                  <Picker.Item label="Manager" value="manager" />
                  <Picker.Item label="VIP" value="vip" />
                </Picker>
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
                    <Text style={{ fontWeight: "bold" }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {users.map((users, i) => (
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
                  <Text style={{ fontWeight: "bold" }}>E-mail:</Text>
                  <Text> {users.eid}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>User Role:</Text>
                  <Text style={{ width: "85%" }}> {users.role}</Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 120 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  onPress={() => handleEdit(users)}
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
      </ImageBackground>
    </View>
  );
};
CRUDUserRole.navigationOptions = {
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
        Users
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
export default CRUDUserRole;

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
