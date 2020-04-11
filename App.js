// bugfix for firebase 7.11.0
import { decode, encode } from "base-64";
global.btoa = global.btoa || encode;
global.atob = global.atob || decode;

import { AppLoading } from "expo";
import FlashMessage, { showMessage } from "react-native-flash-message";

import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";
//import simulate from "./simulator";

import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
console.disableYellowBox = true;

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [view, setView] = useState(true);
  const [passError, setPassError] = useState(false);
  const [register, setRegister] = useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  const handleRegister = async () => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const response = await fetch(
      `https://us-central1-parkingapp-a7028.cloudfunctions.net/initUser?uid=${
        firebase.auth().currentUser.uid
      }`
    );
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
      id: firebase.auth().currentUser.uid,
      role: "student",
      eid: email,
    });

    setEmail("");
    setPassword("");
    setPassword2("");
  };

  const handleLogin = async () => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    setEmail("");
    setPassword("");
    setPassword2("");
  };

  // const checkPassword = (pass, type) => {
  //   console.log("pppppp", pass , type);
  //   if(type === 1) {
  //     setPassword(pass);
  //   } else {
  //     setPassword2(pass);
  //   }
  //   if(password === password2){
  //     setPassError(false);
  //   } else {
  //     setPassError(true);
  //   }
  // };

  useEffect(() => {
    if (password === password2) {
      setPassError(false);
      setRegister(false);
    } else {
      setPassError(true);
      setRegister(true);
    }
  }, [password, password2]);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.Os == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>CNA-Q ParkingApp</Text>
            <View style={styles.formView}>
              {view ? (
                <View>
                  <Text style={styles.heading}>Register</Text>
                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 3,
                    }}
                    onChangeText={setEmail}
                    placeholder="Email"
                    value={email}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 3,
                    }}
                    onChangeText={setPassword}
                    // onChangeText={(text)=>checkPassword(text, 1)}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 3,
                      marginBottom: 2,
                    }}
                    onChangeText={setPassword2}
                    // onChangeText={(text)=>checkPassword(text, 2)}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={password2}
                  />
                  {/* <Button title="Register" onPress={handleRegister} /> */}
                  {passError && (
                    <Text style={{ color: "#f76f6f" }}>
                      * Password Does not match
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.button}
                    disabled={register}
                  >
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>

                  <Text
                    onPress={() => setView(!view)}
                    style={styles.bottomText}
                  >
                    Exisitng User? Login
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.heading}>Login</Text>

                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 3,
                    }}
                    onChangeText={setEmail}
                    placeholder="Email"
                    value={email}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 3,
                      marginBottom: 2,
                    }}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                  />
                  <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                  {/* <Button title="Login" onPress={handleLogin} /> */}

                  <Text
                    onPress={() => setView(!view)}
                    style={styles.bottomText}
                  >
                    New User? Register
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
        <FlashMessage position="top" />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png"),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 30,
    height: "100%",
    width: "100%",
    backgroundColor: "#276b9c",
    justifyContent: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  formView: {
    width: "100%",
  },
  heading: {
    textAlign: "center",
    fontSize: 30,
    color: "white",
    margin: 20,
    marginTop: 0,
    ...Platform.select({
      ios: {
        fontFamily: "GillSans-Light",
      },
      android: {
        fontFamily: "sans-serif-light",
      },
    }),
  },
  bottomText: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    ...Platform.select({
      ios: {
        fontFamily: "GillSans-Light",
      },
      android: {
        fontFamily: "sans-serif-light",
      },
    }),
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    backgroundColor: "#649e6d",
    alignItems: "center",
    marginTop: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    ...Platform.select({
      ios: {
        fontFamily: "GillSans-Light",
      },
      android: {
        fontFamily: "sans-serif-light",
      },
    }),
  },
});
