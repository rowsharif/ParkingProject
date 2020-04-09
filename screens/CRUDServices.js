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
  View,Picker
} from "react-native";
import * as Animatable from 'react-native-animatable';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handleServices = firebase.functions().httpsCallable("handleServices");



const CRUDServices = (props) => {

  const [services, setServices] = useState([]);
  const [price, setPrice] = React.useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");



  useEffect(() => {

    db.collection("Services").onSnapshot(querySnapshot => {

      const services = [];
      querySnapshot.forEach(doc => {
        services.push({ id: doc.id, ...doc.data() });
      });

      console.log(" Current services: ", services);

      setServices([...services]);
    });
  }, []);



  const handleSend = async () => {

    if (id) {
      const response2 = await handleServices({
        service: { id, name, price },
        operation: "update"
      });
    } 

    else {
      const response2 = await handleServices({

        service: { name, price },

        operation: "add"
      });
    }
    setName("");
    setPrice("");
    setId("");
  };
  const handleEdit = service => {
    setName(service.name);

    setPrice(service.price);

    setId(service.id);
  };

  const handleDelete = async service => {

    const response2 = await handleServices({
      service: service,
        operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
        {services.map((service, i) => (
          <View key={i}style={{ paddingTop: 50, flexDirection: "row" }}>

            <Text style={styles.getStartedText}>
              {service.name} - 

              {service.price}
            </Text>

            <Animatable.View animation="shake" iterationCount={3} style={{ textAlign: 'center' }}><Button title="Edit" onPress={() => handleEdit(service)} /></Animatable.View>

            <Animatable.View animation="shake" iterationCount={3} style={{ textAlign: 'center' }}><Button title="X" onPress={() => handleDelete(service)} /></Animatable.View>
          </View>
        ))}

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setPrice}
        placeholder="Price"
        value={price}
      />


<Animatable.View animation="bounceIn" iterationCount={3} style={{ textAlign: 'center' }}><Button title="Send" onPress={handleSend} /></Animatable.View>

<Animatable.View animation="bounceIn" iterationCount={3} style={{ textAlign: 'center' }}><Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button></Animatable.View>

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
