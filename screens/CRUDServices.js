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
  
//////////usestate hook that allows to have state variables in a functional component.
//////////I have an array of services that pushes all the services objects in an array from the database that is used in the useEffect hook(to be explained)
////////I have price,name and id variables as objects that will set the services objects valriables individually.
  const [services, setServices] = useState([]);
  const [price, setPrice] = React.useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");



////////useEffect hook is used to perform an action to the components after rendering
////below useEffect is calling Services collection from the database. The query below gets the database collection
//////services is an empty,temporary array within the query
/////this empty array will get each object from the Services collection in the database by pushing the id and all other data from the database
///// the temporary array will now be carrying objects of Services collections
//// the useState services array will then recieve all the temporary services objects using setServices by adding all the rendered objects
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
    } else {
      // call serverless function instead
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
    ////////View is a container that supports the layout controls. Style can be added to the view of the container. Views can have many children of any type. View can also be nested within other view
    <View style={styles.container}>
     
        {services.map((service, i) => (
          <View key={i}style={{ paddingTop: 50, flexDirection: "row" }}>


            {/* Text component is used to display the text in the application. Below text component have addition style that gets from the stylesheet created below. */}
            <Text style={styles.getStartedText}>
              {service.name} - {service.price}
            </Text>

{/* Animatable.View component is used to animate things. Since it is used under a view component, the animation component will be used as animatable.view
the animation prop is used to name the animation that we want. Below is a shake animation. This will shake the component within the animatable component
iterationcount is the number of times the animation should work. Below, the animation will only shake 3 times */}

            <Animatable.View animation="shake" iterationCount={3} style={{ textAlign: 'center' }}><Button title="Edit" onPress={() => handleEdit(service)} /></Animatable.View>
            <Animatable.View animation="shake" iterationCount={3} style={{ textAlign: 'center' }}><Button title="X" onPress={() => handleDelete(service)} /></Animatable.View>
          </View>
        ))}






{/* TextInput is a react native component that is used to input text into the app using keyboard.
onChangeText is an event in the textinput that is used to read the inputs. Below onChangeText event calls setName variable from the useState. This will read the name from the useState name variable
Value prop is used to set a value to the input. Below example shows name as a value to the input field. The name as a value is a default value. However, if the value should be changed, the onChangeText event will do the operation.
Moreover, style is allowing the user to control the display of the textinput. 
Placeholder is a string that will be rendered before text is entered in the textinput */}
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

{/* Button component is used to interact with the screen.
The title in the button is the text that is displayed in the button
onPress props is used to call a function, handle an action from the function, and perform that action when the user clicks the button. Below example shows the send button that calls the function handleSend to perform some action from the function
 */}

<Animatable.View animation="bounceIn" iterationCount={3} style={{ textAlign: 'center' }}><Button title="Send" onPress={handleSend} /></Animatable.View>


{/* The below button have additional events such as adding color to the button,and onPress. 
props.navigation.goBack() is a prop that is used in a screen component. goBack() function closes the active screen and goes back to the stack. */}
<Animatable.View animation="bounceIn" iterationCount={3} style={{ textAlign: 'center' }}><Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button></Animatable.View>

    </View>
  );
};


// navigationOption is a static property that is used to return an Object. Below returns a headertitle; a text and image that will be displayed as a header in the topnavbar.
//  Also, the navigationOption returns styles of the header such as headerStyle, headerTintColor, and headerTitleStyle. 
//  Below, headerStyle returns a style object such as background color and the height of the topnavbar.
//  Below, headerTintColor returns a style object such as hashcode of the color that will be applied to the View that wraps the header
//  Below,headerTitleStyle returns a style object such as fontweight that will be applied on the text of the header


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
