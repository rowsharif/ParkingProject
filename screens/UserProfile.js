import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  ImageBackground,
  ProgressBarAndroid,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Avatar } from "react-native-elements";

import "firebase/functions";
import db from "../db";
import * as ImagePicker from "expo-image-picker";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const UserProfile = (props) => {
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("+974");
  const [email, setemail] = useState("");
  const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uid, setuid] = useState();
  const [progress, setProgress] = useState(0);
  const [showProgress, setshowProgress] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [time, setTime] = useState(1);
  const [phonevalidate, setPhonevalidate] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    console.log("uid", firebase.auth().currentUser.uid);
    setuid(firebase.auth().currentUser.uid);
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        const user = { id: doc.id, ...doc.data() };
        setUser(user);
        console.log("USERS", user);
      });
  }, []);

  const handleSet = () => {
    const user = firebase.auth().currentUser;
    setDisplayName(user.displayName);
    setphoneNumber(user.phoneNumber);
    setemail(user.email);
    setPhotoURL(user.photoURL);
    setUri(user.photoURL);
  };

  useEffect(() => {
    handleSet();
  }, []);

  const handleSave = async () => {
    setView(false);
    // const response2 = await fetch(
    //   `https://us-central1-parkingapp-a7028.cloudfunctions.net/updateUser?uid=${uid}
    // &displayName${displayName}&photoURL${uri}&email${email}&phoneNumber${phoneNumber}`
    // );

    if(phoneNumber.length===12){
      
      const updateUser = firebase.functions().httpsCallable("updateUser");
    const response2 = await updateUser({
      uid,
      displayName,
      photoURL: uri,
      email,
      phoneNumber: phoneNumber,
    });
    showMessage({
      title: "Saved!",
      message: "You will see changes in the next login",
      type: "success",
      backgroundColor:"#75213d",
      duration:2300
    });
    
    
      setPhonevalidate(true)
    }
    else{
      setPhonevalidate(false)
      alert(
        "Enter atleast 11 digits of phone number with the country code starting with a +",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed"),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
    // console.log("ppppppphhhhhhhh",phoneNumber.length)
    // console.log("uuuuuuuuu", phoneNumber);
    
   
    // console.log("new displayName", firebase.auth().currentUser.displayName);
  };

  const handleUpload = async () => {
    if (uri !== photoURL) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const putResult = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .put(blob);
      const url = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .getDownloadURL();
      setUri(url);
      setPhotoURL(url);
    }
  };
  const timer = async () => {
    setshowProgress(true);
    setTime(time - 1);
    setProgress(progress + 0.3);
    if (time - 1 <= 0) {
      await handleUpload();
      setshowProgress(false);
      clearTimeout(timeoutId);
    }
  };

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);

      setProgress(0);
      setTime(5);
    }
  };
  useEffect(() => {
    time > 0 && setTimeoutId(setTimeout(() => timer(), 1000));
  }, [time]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        {/* <ScrollView style={styles.container} keyboardShouldPersistTaps="always"> */}
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 24,
            margin: "2%",
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
            backgroundColor: "#C8C8C8",
            //backgroundColor: "#C8C8C8",
          }}
          editable={false}
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
            margin: "2%",
          }}
          onChangeText={setphoneNumber}
          placeholder="Phone number"
          value={phoneNumber}
        />

        {photoURL !== "" && (
          <Image
            style={{ width: 100, height: 100, margin: "2%" }}
            source={{
              uri: photoURL
                ? photoURL
                : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            }}
          />
        )}
        {showProgress && (
          <View style={{ margin: "2%" }}>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress}
              animating={true}
              color="blue"
            />
          </View>
        )}
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              flex: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                textAlign: "center",
                borderColor: "blue",
                backgroundColor: "#d6fffc",
                width: "auto",
                margin: "3%",
                alignSelf: "center",
                padding: "3%",
              }}
              onPress={handlePickImage}
            >
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>

           
            
          </View>

          {user && user.role && user.role == "manager" ? (
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
                <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDPayments")}
              >
                <Text style={styles.buttonText}>Users Bills</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDServices")}
              >
                <Text style={styles.buttonText}>Handle Service</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDUserRole")}
              >
                <Text style={styles.buttonText}>User role</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDHistory")}
              >
                <Text style={styles.buttonText}>Handle History</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDPromotion")}
              >
                <Text style={styles.buttonText}>Handle Promotion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDEmployee")}
              >
                <Text style={styles.buttonText}>Handle Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "1%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("EmployeeServices")}
              >
                <Text style={styles.buttonText}>EmployeeServices</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDCrew")}
              >
                <Text style={styles.buttonText}>Handle Crew</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "1%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDNewsletter")}
              >
                <Text style={styles.buttonText}>Handle Newsletter</Text>
              </TouchableOpacity>
            </View>
          ) 
          : user && user.role && user.role == "employee" ? (
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
               <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("EmployeeServices")}
              >
                <Text style={styles.buttonText}>Employee Services</Text>
              </TouchableOpacity>
            </View>): user && user.role && user.role == "student" ? (
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
               <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDMyPayments")}
              >
                <Text style={styles.buttonText}>My Bills</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("FAQ")}
              >
                <Text style={styles.buttonText}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "3%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDMyProfile")}
              >
                <Text style={styles.buttonText}>My Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flex: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "1%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDParkings")}
              >
                <Text style={styles.buttonText}>Handle parking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "1%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() => props.navigation.navigate("CRUDParkingLots")}
              >
                <Text style={styles.buttonText}>Handle parking lot</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  textAlign: "center",
                  borderColor: "blue",
                  backgroundColor: "#d6fffc",
                  width: "auto",
                  margin: "1%",
                  alignSelf: "center",
                  padding: "3%",
                }}
                onPress={() =>
                  props.navigation.navigate("CRUDNearestBuildings")
                }
              >
                <Text style={styles.buttonText}>Handle NearestBuildings</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* </ScrollView> */}
        </ScrollView>
      </ImageBackground>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

UserProfile.navigationOptions = (props) => ({
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
          paddingLeft: "3%",
        }}
      >
        UserProfile
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
});

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    borderWidth: 1,
    textAlign: "center",
    borderColor: "blue",
    backgroundColor: "#d6fffc",
    width: "80%",
    margin: "1%",
    alignSelf: "center",
  },

  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  button: {
    margin: "5%",
  },
  contentContainer: {},
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
