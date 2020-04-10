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
  Picker,
} from "react-native";
import IOSPicker from 'react-native-ios-picker';

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

//import { handleParkings } from "../functions";
const handleNearestBuilding = firebase
  .functions()
  .httpsCallable("handleNearestBuilding");

const CRUDNearestBuildings = (props) => {
  const [nearestBuilding, setNearestBuilding] = useState([]);
  const [number, setNumber] = useState("");
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [ParkingLot, setParkingLot] = useState([]);
  const [ParkingLots, setParkingLots] = useState([]);

  useEffect(() => {
    db.collection("ParkingLots").onSnapshot((querySnapshot) => {
      const parkingLots = [];
      querySnapshot.forEach((doc) => {
        parkingLots.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current parkingLots: ", parkingLots);
      setParkingLots([...parkingLots]);
    });

    db.collection("NearestBuildings").onSnapshot((querySnapshot) => {
      const nearestBuilding = [];
      querySnapshot.forEach((doc) => {
        nearestBuilding.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current nearestBuilding: ", nearestBuilding);
      setNearestBuilding(nearestBuilding);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleNearestBuilding({
        nearestBuilding: { id, name, number, ParkingLot },
        operation: "update",
      });
    } else {
      // call serverless function instead
      const response2 = await handleNearestBuilding({
        nearestBuilding: { name, number, ParkingLot },
        operation: "add",
      });
    }
    setName("");
    setNumber("");
    setId("");
  };

  const handleEdit = (nearestBuilding) => {
    setName(nearestBuilding.name);
    setNumber(nearestBuilding.number);
    setId(nearestBuilding.id);
    setParkingLot(
      ParkingLots.filter((p) => p.id === nearestBuilding.ParkingLot.id)[0]
    );
  };
  const handleDelete = async (nearestBuilding) => {
    const response2 = await handleNearestBuilding({
      nearestBuilding: nearestBuilding,
      operation: "delete",
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {nearestBuilding.map((nearestBuilding, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {nearestBuilding.name} - {nearestBuilding.number}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(nearestBuilding)} />
            <Button title="X" onPress={() => handleDelete(nearestBuilding)} />
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setNumber}
        placeholder="number"
        value={`${number}`}
      />
       {Platform.OS === "ios" ? (
         <IOSPicker
         style={styles.picker}
         itemStyle={styles.pickerItem}
         selectedValue={ParkingLot}
         onValueChange={(itemValue) => setParkingLot(itemValue)}
       >
         {ParkingLots.map((ParkingLot, i) => (
           <Picker.Item label={ParkingLot.name} value={ParkingLot} />
         ))}
       </IOSPicker>
        ) : (
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={ParkingLot}
        onValueChange={(itemValue) => setParkingLot(itemValue)}
      >
        {ParkingLots.map((ParkingLot, i) => (
          <Picker.Item label={ParkingLot.name} value={ParkingLot} />
        ))}
      </Picker>
        )}

      <Button title="Send" onPress={handleSend} />
      <Button
        color="green"
        title="Cancel"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </View>
  );
};

CRUDNearestBuildings.navigationOptions = {
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
export default CRUDNearestBuildings;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //alignItems: 'center',
    //justifyContent: "center",
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
