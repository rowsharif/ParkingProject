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
import { createNativeWrapper } from 'react-native-gesture-handler';
const handleEmployee = firebase.functions().httpsCallable("handleEmployee");

const CRUDServices = (props) => {
  const [employee, setEmployee] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("+974");
  const [email, setemail] = useState("");
  const[parking,setParking]=useState([]);
  const [type, setType] = React.useState("");
  const [id, setId] = React.useState("");
  const [uid, setuid] = useState();

  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  useEffect(() => {
    setuid(firebase.auth().currentUser.uid);
    askPermission();
  }, []);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    setDisplayName(user.displayName);
    setphoneNumber(user.phoneNumber);
    setemail(user.email);
    db.collection("ParkingLots").doc().collection("Crew").doc().collection("Employee").get().then(querySnapshot => {
      const employee = [];
      querySnapshot.forEach(doc => {
        employee.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current services: ", employee);
      setCrew([...employee]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleEmployee({
        employee: { id, type},
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleEmployee({
        employee: { type },
        operation: "add"
      });
    }
 setType("");
   
    setId("");
    const updateUser = firebase.functions().httpsCallable("updateUser");
    const response2 = await updateUser({
      uid,
      displayName,
      photoURL: uri,
      email,
      phoneNumber:phoneNumber
    });
   
  };

  const handleEdit = employee => {
    setType(employee.type);
   
    setId(employee.id);
  };
  const handleDelete = async employee => {
    const response2 = await handleEmployee({
        employee: employee,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
     <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 24,
            margin: "2%"
          }}
          onChangeText={setDisplayName}
          placeholder="Display Name"
          value={displayName}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 24,
            margin: "2%",
          }}
          onChangeText={setemail}
          placeholder="Email"
          value={email}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 24,
            margin: "2%"
          }}
          onChangeText={setphoneNumber}
          placeholder="Phone number"
          value={phoneNumber}
        />
        {employee.map((employee, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {employee.type} - 
            </Text>
            <Button title="Edit" onPress={() => handleEdit(employee)} />
            <Button title="X" onPress={() => handleDelete(employee)} />
          </View>
        ))}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
    




    <Picker
          style={styles.picker} itemStyle={styles.pickerItem}
          selectedValue={employee}
          onValueChange={(itemValue) => setEmployee([...employee])}
        >
            {crew.map((crew, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
               <Picker.Item label={crew.name} value={crew.name} />
         
            </Text>
          
          </View>
        ))}
         
        </Picker>





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