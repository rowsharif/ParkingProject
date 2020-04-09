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

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handleCRUDParkings = firebase.functions().httpsCallable("handleCRUDParkings");

const CRUDParkings =(props)=> {
  const [parkings, setParkings] = useState([]);
  console.log("---dddd-",parkings)
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setlatitude] = React.useState(0);
  const [amountperhour, setAmountperhour] = React.useState("");
  const [type, setType] = React.useState("");
  const [id, setId] = React.useState("");
  const [ParkingLot,setParkingLot] = useState([]);
  const [ParkingLots, setParkingLots] =useState([]);

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
      .then(querySnapshot => {
        const ParkingLots = [];
        let allParkings = [];
        querySnapshot.forEach(doc => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Parkings")
            .onSnapshot(querySnapshot => {
              const nparkings = [];
              allParkings = allParkings.filter(p => p.fk !== doc.id);
              querySnapshot.forEach(docP => {
                nparkings.push({ fk: doc.id, id: docP.id, ...docP.data() });
              });
              allParkings = [...allParkings, ...nparkings];
              setParkings([...allParkings]);
            });
        });
        setParkingLots([...ParkingLots]);
      });
    },[]);


  const handleSend = async () => {
    if (id) {
      const response2 = await handleCRUDParkings({
        parking: { id, longitude, latitude,amountperhour,type },
        operation: "update"
      });
    } else {
      
      const response2 = await handleCRUDParkings({
        parking: { longitude, latitude,amountperhour,type },
        operation: "add"
      });
    }
    setLongitude("");
    setlatitude("");
    setAmountperhour("");
    setType("");
    setId("");
  };

  const handleEdit = parking => {
    setlatitude(parking.latitude);
    setLongitude(parking.longitude);
    setAmountperhour(parking.amountperhour);
    setType(parking.type);
    setId(parking.id);
  };
  const handleDelete = async parking => {
    const response2 = await handleCRUDParkings({
      parking: parking,
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
        {parkings.map((parking, i) => (
          <View key={i}style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {parking.latitude} - {parking.longitude} - {parking.amountperhour} - {parking.type}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(parking)} />
            <Button title="X" onPress={() => handleDelete(parking)} />
          </View>
        ))}
      </ScrollView>
      {/* <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setlatitude}
        placeholder="latitude"
        value={latitude}
      />
       <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setLongitude}
        placeholder="longitude"
        value={longitude}
      /> */}
       <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setAmountperhour}
        placeholder="Amount per hour"
        value={`${amountperhour}`}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setType}
        placeholder="Type"
        value={type}
      />
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
        
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Cancel" onPress={() => props.navigation.goBack()} ></Button>

    </View>
  );
}

CRUDParkings.navigationOptions = {
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
export default CRUDParkings;

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