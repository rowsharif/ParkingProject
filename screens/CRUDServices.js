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
////calls the handleServices method from the firebase functions folder,index.js file
/// httpsCallable is a reference to a "callable" http actions in firebase Functions.
const handleServices = firebase.functions().httpsCallable("handleServices");



const CRUDServices = (props) => {
  
//////////usestate hook that allows to have state variables in a functional component.
//////////created an array of services and set it to empty array as an initial value 
  const [services, setServices] = useState([]);
  ////////created a price variable and set the initial value of the price as 0
  const [price, setPrice] = React.useState(0);
  ////created name component and set the initial value as an empty string 
  const [name, setName] = React.useState("");
  ///created id component and set the initial value as an empty string.
  const [id, setId] = React.useState("");



////////useEffect hook is used to perform an action to the components after rendering
  useEffect(() => {
    //// The query below gets the Services collection from the firebase database 

    db.collection("Services").onSnapshot(querySnapshot => {
      //////services is an empty,temporary array within the query

      const services = [];
      /////this empty array will get each object from the Services collection in the database by pushing the id and all other data from the database through the loop
      querySnapshot.forEach(doc => {
        services.push({ id: doc.id, ...doc.data() });
      });
      ///// the temporary array will now be carrying objects of Services collections

      console.log(" Current services: ", services);
      //// the useState setservices array will then recieve all the temporary services objects using setServices by filling all the rendered objects

      setServices([...services]);
    });
  }, []);


  /////handleSend method calls the method from functions folder, index.js file(firebase function)

  const handleSend = async () => {
      ///// it checks if there is an id sent, 

    if (id) {
      ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return
      const response2 = await handleServices({
       //// sends the service object 
        service: { id, name, price },
        ////and finally returns an update operation to check the update query from the method in the firebase function folder 
        operation: "update"
      });
    } 
      ////else if there isnt any id sent

    else {
      ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return
      const response2 = await handleServices({

      //// creates a new service object 
        service: { name, price },

        ////and finally returns the add operation to check the add query from the method in the firebase function folder 
        operation: "add"
      });
    }
    /// then it sets back the input value to empty string
    setName("");
    setPrice("");
    setId("");
  };
///////handleEdit gets the object entered in the textinput and sends back the new name,price and id of the the new editted object to the useState 
  const handleEdit = service => {
    ///sets the original, before edit name value to the useState
    setName(service.name);

    ///sets the original, before edit price value to the useState
    setPrice(service.price);

        ///sets the original, before edit id value to the useState
    setId(service.id);
  };

  ////////handleDelete method gets the object and deletes the object using the firebase function created in index.js. 
  const handleDelete = async service => {
      ///then call the handleServices method from the firebase functions folder, index.js. An await is used to wait to get a return from the database since it takes long time to get a return

    const response2 = await handleServices({
      ///the service object is recognized
      service: service,
        ////and finally returns the delete operation to check the add query from the method in the firebase function folder 
        operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
    {/* mapping through the services array to display each object of services */}
        {services.map((service, i) => (
          <View key={i}style={{ paddingTop: 50, flexDirection: "row" }}>
{/* key is the unique key of component which is set as the index of the the services */}

            <Text style={styles.getStartedText}>
              {/* displays each name of the service by looping through services array */}
              {service.name} - 

                            {/* displays each price of the service by looping through services array */}
              {service.price}
            </Text>

{/* handleEdit method is called in the button and sends the service object generated from the services loop to edit the object*/}
            <Animatable.View animation="shake" iterationCount={3} style={{ textAlign: 'center' }}><Button title="Edit" onPress={() => handleEdit(service)} /></Animatable.View>

            {/* handleDelete method is called in the button and sends the service object generated from the services loop to delete the object */}
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
