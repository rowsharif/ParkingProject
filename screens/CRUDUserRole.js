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
import { setWorldAlignment } from "expo/build/AR";
console.disableYellowBox = true;

const handleRole = firebase.functions().httpsCallable("handleRole");

const CRUDUserRole = (props) => {
  const [users, setusers] = useState([]);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [eid, seteid] = useState("");

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
  };

  const handleEdit = (user) => {
    setId(user.id);
    setRole(user.role);
    seteid(user.eid);
  };
  return (
    <ScrollView>
      {users.map((users, i) => (
        <View key={i} style={{ paddingTop: 50, flexDirection: "row" }}>
          <Text style={styles.getStartedText}>
            {users.role} --- {users.eid}
          </Text>
          <Button title="Edit" onPress={() => handleEdit(users)} />
        </View>
      ))}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={seteid}
        placeholder="email"
        value={eid}
        editable={false}
        style={{
          backgroundColor: "#C8C8C8",
        }}
      />
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="employee" value="employee" />
        <Picker.Item label="admin" value="admin" />
        <Picker.Item label="student" value="student" />
        <Picker.Item label="staff" value="staff" />
        <Picker.Item label="manager" value="manager" />
        <Picker.Item label="vip" value="vip" />
      </Picker>

      <Button title="Send" onPress={handleSend} />
      <Button
        color="green"
        title="Cancel"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </ScrollView>
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
});
