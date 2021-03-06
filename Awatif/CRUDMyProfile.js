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
// const handlehistories = firebase.functions().httpsCallable("handleHistory");

const CRUDhistories = (props) => {
  const [histories, sethistories] = useState([]);
  const [DateTime, setDateTime] = React.useState();
  const [Duration, setDuration] = React.useState(0);
  const [TotalAmount, setTotalAmount] = React.useState(0);
  const [id, setId] = React.useState("");
  const [car,setCar]= useState([])
 
  useEffect(() => {

  db.collection("Cars").onSnapshot(querySnapshot => {
    const car = [""];
    querySnapshot.forEach(doc => {
      car.push({ id: doc.id, ...doc.data() });
    });
    setCar([...car]);

  });
},[]);
  useEffect(() => {
    
    db.collection("History").whereEqualTo(FieldPath.documentId(),firebase.auth().currentUser.uid).get().then(querySnapshot => {
    const history = [""];
    querySnapshot.forEach(doc => {
      history.push({ id: doc.id, ...doc.data() });
    });
    sethistories([...history]);
  });

}, []);


  return (
    <ScrollView>
     <Text style={{textAlign:"center",fontWeight:"bold"}}>
       Users history </Text>
 {histories.map((history,i)=>(
    <View key={i}style={{ borderColor: "gray",
    borderWidth: 1,}}>
      <Text>
  {"Total Amount - "+ history.TotalAmount+"QR,      Car - "+ history.CarId + " ,   Parking-  "+ history.ParkingId+ " ,   Duration-  "+history.Duration+"\n"}</Text></View>
 ))}     
     
        
      <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button>

    </ScrollView>
  );
};
CRUDhistories.navigationOptions = {
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
  export default CRUDhistories;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 
