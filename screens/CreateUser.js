//@refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ShadowPropTypesIOS,Image } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";
import { TextInput } from 'react-native-paper';
import db from "../db.js";


const CreateUser = (props) => {
    const [name,setName]=useState("");
    const [price,setPrice]=useState(0)
    const[services,setservices]=useState([])
    // const addCar = async () => {
    //     let servicess = db
    //       .collection("Services")
    //       .add({ name, price });
    //     setservices([...services, { servicess }]);
    //     console.log(services)
    //   };

    const handleSend = async () => {
       
          // call serverless function instead
          const sendservices = firebase.functions().httpsCallable("sendservices");
          const response2 = await sendservices({ name,price });
          console.log("sendservices response", response2);
    
          // db.collection("messages").add({ from, to, text });
        
        
      };
    return (
        <View style={styles.container}>
            <Text>Good Job</Text>
            <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          fontSize: 24,margin:"2%" 
        }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />     
       <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          fontSize: 24,margin:"2%" 
        }}
        onChangeText={setPrice}
        placeholder="Price"
        value={price}
      />     
             <Button title="save" onPress={handleSend}></Button>
            <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ><AntDesign name="back" size={30} color="black" /></Button>
            
        </View>
    );

};
CreateUser.navigationOptions = {
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
  export default CreateUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        // alignItems: 'center',
        // justifyContent: "center",
        
    },
}); 
