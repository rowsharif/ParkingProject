//@refresh reset
import React, { useState, useEffect } from 'react';
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
const handleCrew = firebase.functions().httpsCallable("handleCrew");

const CRUDServices = (props) => {
  const [crew, setCrew] = useState([]);
  const[parking,setParking]=useState([]);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("ParkingLots").doc().collection("Crew").get().then(querySnapshot => {
      const crew = [];
      querySnapshot.forEach(doc => {
        crew.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current services: ", crew);
      setCrew([...crew]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleCrew({
        crew: { id, name},
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleCrew({
        crew: { name },
        operation: "add"
      });
    }
    setName("");
   
    setId("");
  };

  const handleEdit = crew => {
    setName(crew.name);
   
    setId(crew.id);
  };
  const handleDelete = async crew => {
    const response2 = await handleCrew({
        crew: crew,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
     
        {crew.map((crew, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {crew.name} - 
            </Text>
            <Button title="Edit" onPress={() => handleEdit(service)} />
            <Button title="X" onPress={() => handleDelete(service)} />
          </View>
        ))}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
    
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button>

    </View>
  );
};
CRUDServices.navigationOptions = {
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
  export default CRUDServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 
