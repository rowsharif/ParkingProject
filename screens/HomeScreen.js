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
  ImageBackground
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { Avatar } from 'react-native-elements';

import Message from "./Message.js";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [to, setTo] = React.useState("");
  const [text, setText] = React.useState("");
  const [id, setId] = React.useState("");

  const [Cars, setCars] = React.useState([]);
  const [Car, setCar] = React.useState({});
  const [PlateNumber, setPlateNumber] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState({});

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
      .onSnapshot(querySnapshot => {
        const Cars = [];
        querySnapshot.forEach(doc => {
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

  const deleteCar = async car => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("Cars")
      .doc(car.id)
      .delete();
    setCars(Cars.filter(c => c.id != car.id));
  };

  const handleSend = async () => {
    const from = currentUser.uid;
    if (id) {
      db.collection("messages")
        .doc(id)
        .update({ from, to, text });
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

  const handleEdit = message => {
    setTo(message.to);
    setText(message.text);
    setId(message.id);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleCar = c => {
    c.current = true;
    Cars.map(car => {
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
  };

  return (
    
                
    <View style={styles.container}>
      <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
      {/* <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {messages.map((message, i) => (
          <Message key={i} message={message} handleEdit={handleEdit} />
        ))}
      </ScrollView> */}
      {/* <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setTo}
        placeholder="To"
        value={to}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setText}
        placeholder="Text"
        value={text}
      />
      <Button title="Send" onPress={handleSend} /> */}
      <View>
        <Text
          style={{
            paddingTop: 10,
            fontSize: 18,
            fontWeight: "700"
          }}
        >
          Welcome {currentUser.displayName}
        </Text>
        <View>
                    <Avatar
  rounded
  source={{
    uri:
      currentUser.photoURL
  }}
/>
</View>
<Text>Email: {currentUser.email}</Text>
<Text>Phone number: {currentUser.phoneNumber}</Text>
<Text>Display Name:{currentUser.displayName}</Text>
        <Text style={{ fontSize: 17 }}>Car: {Car && Car.PlateNumber}</Text>
        <TouchableOpacity
          style={[styles.button, { display: "flex" }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <View style={{ marginTop: 0 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View
              style={{
                marginTop: 22,
                backgroundColor: "white",
                
                width: "100%",
                height: "98%"
              }}
            >
            <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>
              <View style={{padding:10}}>
             
        
 <Text
                style={{
                  paddingTop: 10,
                  fontSize: 18,
                  fontWeight: "700"
                }}
              >
                Which car are you driving?
              </Text> 
              
              {Cars &&
                Cars.length > 0 &&
                Cars.map((car, i) => (
                  <View key={car.id}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleCar(car)}
                    >
                      <Text style={styles.buttonText}>{car.PlateNumber}</Text>
                    </TouchableOpacity>
                    <Button title="X" onPress={() => deleteCar(car)} />
                  </View>
                ))}
              {Cars.length < 2 && (
                <View style={{ paddingTop: "30%" }}>
                  <Text>Add a Car</Text>
                  <TextInput
                    style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                    onChangeText={setPlateNumber}
                    placeholder=" PlateNumber"
                    value={PlateNumber}
                  />
                  <Button title="Add" onPress={addCar} />
                </View>
              )}
              </View>
              </ImageBackground>
            </View>
          </View>          
        </Modal>
      </View>
      </ImageBackground>
    </View>
    
  );
}

HomeScreen.navigationOptions = {
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
        Home
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

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: "center",
    fontSize: 18
  },
  button: {
    borderWidth: 1,
    textAlign: "center",
    borderColor: "blue",
    backgroundColor: "#d6fffc",
    width: "80%",
    margin: "1%",
    alignSelf: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
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
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
