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
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { Avatar } from "react-native-elements";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5, 
} from "@expo/vector-icons";
import Message from "./Message.js";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [id, setId] = useState("");

  const [Cars, setCars] = useState([]);
  const [Car, setCar] = useState({});
  const [PlateNumber, setPlateNumber] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [welcome, setWelcome] = useState(true);

  const s = welcome.sort
  // useEffect(() => {
  //   db.collection("messages").onSnapshot(querySnapshot => {
  //     const messages = [];
  //     querySnapshot.forEach(doc => {
  //       messages.push({ id: doc.id, ...doc.data() });
  //     });
  //     console.log(" Current messages: ", messages);
  //     setMessages([...messages]);
  //   });
  // }, []);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cars")
      .onSnapshot((querySnapshot) => {
        const Cars = [];
        querySnapshot.forEach((doc) => {
          Cars.push({ id: doc.id, ...doc.data() });
        });
        console.log(" Current Cars: ", Cars);
        setCars([...Cars]);
      });
    setCurrentUser(firebase.auth().currentUser);
  }, []);

  const addCar = async () => {
    let car = db
      .collection("users")
      .doc(currentUser.uid)
      .collection("Cars")
      .add({ PlateNumber, current: false, Parking: {} });
    setCars([...Cars, { car }]);
    setPlateNumber("");
  };

  const deleteCar = async (car) => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("Cars")
      .doc(car.id)
      .delete();
    setCars(Cars.filter((c) => c.id != car.id));
  };

  const handleSend = async () => {
    const from = currentUser.uid;
    if (id) {
      db.collection("messages").doc(id).update({ from, to, text });
    } else {
      // call serverless function instead
      const sendMessage = firebase.functions().httpsCallable("sendMessage");
      const response2 = await sendMessage({ from, to, text });
      console.log("sendMessage response", response2);

      // db.collection("messages").add({ from, to, text });
    }
    setTo("");
    setText("");
    setId("");
  };

  const handleEdit = (message) => {
    setTo(message.to);
    setText(message.text);
    setId(message.id);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleCar = (c) => {
    c.current = true;
    Cars.map((car) => {
      if (car.id === c.id) {
        car.current = true;
        db.collection("users")
          .doc(currentUser.uid)
          .collection("Cars")
          .doc(car.id)
          .set(car);
      } else {
        car.current = false;
        db.collection("users")
          .doc(currentUser.uid)
          .collection("Cars")
          .doc(car.id)
          .set(car);
      }
    });

    console.log("Cars", Cars);
    setModalVisible(false);
    setCar(c);
    
    showMessage({
      title: `Welcome!`,
      message:`Welcome ${currentUser.displayName}!`,
      type: "success",
      backgroundColor:"#75213d",
      duration:2300,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{height:"100%" }}>
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      > 
      <View style={{ height:"100%"}}> 
        {/* { welcome &&
          <View style={{backgroundColor:"#75213d", height:25, flexDirection:"row", alignItems:"center"}}>
          <Text style={{color:"white", textAlign:"center", width:"90%", paddingLeft:"7%"}}>
            Welcome {currentUser.displayName}!
          </Text>
          <View style={{width:"10%", justifyContent:"flex-end", alignItems:"flex-end", marginRight:10}}>
            <Feather  name="x" size={15} color="white" onPress={()=> setWelcome(false)} />
          </View>         
          </View>  
        }    */}
        {/* <Text style={{paddingTop:2, marginLeft:"5%", marginTop:"5%", backgroundColor:"lightgray", width:"20%", fontSize:18, textAlign:"center", borderTopRightRadius:5, borderTopLeftRadius:5, borderBottomWidth:1}}>
          <MaterialCommunityIcons  name="account" size={25} color="black" />
        </Text> */}
        <View style={{marginTop:"18%",backgroundColor:"lightgray", margin:"5%", height:"30%", flexDirection:"row"}}>          
          <View style={{width:"30%", justifyContent:"center", alignItems:"center"}}>
            <Avatar
              rounded
              source={{
                uri: currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
              }}
              size="large"
            />
          </View>
          <View style={{width:"70%", justifyContent:"center", marginLeft:10}}>
            <Text>Name: {currentUser.displayName}</Text>
            <Text>Email: {currentUser.email}</Text>
            <Text>Phone No: {currentUser.phoneNumber}</Text>
            
          </View>   
        </View>
        {/* <Text style={{paddingTop:2, marginLeft:"5%", backgroundColor:"lightgray", width:"20%", fontSize:18, textAlign:"center", borderTopRightRadius:5, borderTopLeftRadius:5, borderBottomWidth:1}}>
          <FontAwesome5  name="car-side" size={25} color="black" />
        </Text> */}
        <View style={{backgroundColor:"lightgray", margin:"5%", height:"30%"}}>
          <View style={{flexDirection:"row", height:"80%"}}>
            <View style={{width:"30%", height:"100%", justifyContent:"center", alignItems:"center"}}>
              <Avatar
                rounded
                source={require("../assets/images/caricon.png")}
                size="large"
              />
            </View>
            <View style={{width:"70%",height:"100%", justifyContent:"center", alignItems:"flex-start", paddingLeft:20}}>
                <Text style={{ fontSize: 17}}>Plate No: {Car && Car.PlateNumber}</Text>
            </View>
          </View>
          
          <View style={{height:"20%", alignItems:"center"}}>
            <TouchableOpacity
              style={{backgroundColor:"#276b9c", width:"100%", height:"150%", justifyContent:"center"}}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Change Car</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
        
        <View style={{ marginTop: 0 }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            // onRequestClose={() => {
            //   setModalVisible(false);
            // }}
          >
            
            <View style={{ marginTop: 22, ...Platform.select({ios: {marginTop:45},android: {},})}}>
            <View
                style={{
                  marginTop: 22,
                  backgroundColor: "white",

                  width: "100%",
                  height: "98%",
                }}
              >
            <KeyboardAvoidingView
                  behavior={Platform.Os == "ios" ? "padding" : "position"}
                  style={styles.container}
                >
             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                  source={require("../assets/images/bg11.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                >
                  
                  <View style={{ padding: 10 }}>
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          paddingTop: 10,
                          fontSize: 18,
                          
                        }}
                      >
                        Choose Your Car
                      </Text>
                      <View style={{ height:150, marginTop:10}}>
                      {Cars &&
                        Cars.length > 0 &&
                        Cars.map((car, i) => (
                          <View key={i} style={{flexDirection:"row", margin:3}}>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() => handleCar(car)}
                            >
                              <Text style={styles.buttonText}>
                                Plate No: {car.PlateNumber}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.buttonRemove}
                              onPress={() => deleteCar(car)}
                            >
                              <Text style={styles.buttonRemoveText}>
                                Remove
                              </Text>
                            </TouchableOpacity>
                            {/* <Button title="X" onPress={() => deleteCar(car)} /> */}
                          </View>
                        ))}
                      </View>
                      {Cars.length < 2 && (
                        <View style={{ paddingTop: "30%" }}>
                          <Text style={{
                          fontSize: 18,                                                    
                          }}>
                            Add a Car (Max. 2)
                          </Text>
                          <TextInput
                            style={{
                              height: 40,
                              borderColor: "gray",
                              borderWidth: 1,
                              paddingLeft: 5,
                              backgroundColor:"white",
                              marginTop:10
                            }}
                            onChangeText={setPlateNumber}
                            placeholder=" PlateNumber"
                            value={PlateNumber}
                          />
                          <TouchableOpacity
                              style={{backgroundColor:"#519c5a", height:40, justifyContent:"center", marginTop:5}}
                              onPress={addCar}                            >
                              <Text style={styles.buttonRemoveText}>
                                Add
                              </Text>
                            </TouchableOpacity>
                          {/* <Button title="Add" onPress={addCar} /> */}
                        </View>
                      )}
                    </View>
                  </View>
                </ImageBackground>
                </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </View>
            </View>
            
          </Modal>
        </View>
        </View> 
      </ImageBackground>
    </View>
    <View style={{justifyContent:"flex-end"}}>
          {/* <Button title="Logout" onPress={handleLogout} /> */}
          <TouchableOpacity
              style={{backgroundColor:"lightgray", width:"100%", height:40, justifyContent:"center"}}
              onPress={handleLogout}            >
              <Text style={{color:"#276b9c", textAlign:"center", fontSize:15}}>Logout</Text>
            </TouchableOpacity>
    </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

HomeScreen.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 2,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          flex: 2,
          paddingTop: 10,
          fontSize: 18,
          fontWeight: "700",
          color: "white",
          textAlign: "left",
          paddingLeft:"3%"
        }}
      >
        Home
      </Text>
      <View
        style={{
          flex: 1,
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

const styles = StyleSheet.create({
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color:"white"
  },
  button: {
    // borderWidth: 1,
    textAlign: "center",
    // borderColor: "blue",
    backgroundColor: "#276b9c",
    width: "80%",
    height: 50,
    marginRight: "1%",
    alignSelf: "center",
    borderTopLeftRadius:5,
    borderBottomLeftRadius:5,
    justifyContent:"center"
    
  },
  buttonRemoveText: {
    textAlign: "center",
    // fontSize: 18,
    color:"white"
  },
  buttonRemove: {    
    width:"20%",
    height:50,
    // margin:"1%",
    backgroundColor: "#ba3838",
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
    justifyContent:"center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
