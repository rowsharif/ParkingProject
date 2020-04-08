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
  View
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
//import { handleParkings } from "../functions";
const handleParkingLot = firebase.functions().httpsCallable("handleParkingLot");

const CRUDParkingLots =(props)=> {
  const [parkingLots, setParkingLot] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("ParkingLots").onSnapshot(querySnapshot => {
      const parkingLots = [];
      querySnapshot.forEach(doc => {
        parkingLots.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current parkingLots: ", parkingLots);
      setParkingLot([...parkingLots]);
    });
  }, []);

  const handleSend = async () => {

    if (id) {
      const response2 = await handleParkingLot({
        parkingLot: { id, name, longitude,latitude },
        operation: "update"
      });

    }
 
    else {
      // call serverless function instead
      const response2 = await handleParkingLot({
        parkingLot: {name, longitude,latitude },
        operation: "add"
      });

    }
    setName("");
    setLongitude("");
    setLatitude("");
    setId("");
  };

  const handleEdit = parkingLot => {
    setName(parkingLot.name);
    setLatitude(parkingLot.latitude);
    setLongitude(parkingLot.longitude);
    setId(parkingLot.id);
  };
  const handleDelete = async parkingLot => {
    const response2 = await handleParkingLot({
      parkingLot: parkingLot,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {parkingLots.map((parkingLot, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {parkingLot.name} - {parkingLot.latitude} -{parkingLot.longitude}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(parkingLot)} />
            <Button title="X" onPress={() => handleDelete(parkingLot)} />
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
        onChangeText={setLatitude}
        placeholder= "latitude"
        //value={latitude}
        value={`${latitude}`}
      />
       <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setLongitude}
        placeholder="longitude"
        //value={longitude}
        value= {`${longitude}`}
      />
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Cancel" onPress={() => props.navigation.goBack()} ></Button>

    </View>
  );
}

CRUDParkingLots.navigationOptions = {
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
export default CRUDParkingLots;

const styles = StyleSheet.create({
  container: {
      flex: 1,
     
      //alignItems: 'center',
      //justifyContent: "center",
    
  },
  picker: {
    width: 200,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  pickerItem: {
    color: 'red'
  },
}); 

