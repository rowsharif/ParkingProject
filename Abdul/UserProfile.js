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
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("+974");
  const [email, setemail] = useState("");
  const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uid, setuid] = useState();
  const user = firebase.auth().currentUser;
  const [progress, setProgress] = useState(0);
  const [showProgress, setshowProgress] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [time, setTime] = useState(1);
  const [phonevalidate,setPhonevalidate]=useState(false);
  const [view,setView]=useState(false);



  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  useEffect(() => {

    setuid(firebase.auth().currentUser.uid);
    askPermission();
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
        'Enter atleast 11 digits of phone number with the country code starting with a +',
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
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
        <View style={{height:"100%", width:"100%", padding:"10%"}}>
        <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "position"}
      
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{height:"100%", width:"100%", backgroundColor:"lightgray", marginTop:"2.5%"}}>
            
            <View style={{height:"48%", justifyContent:"center", alignItems:"center", padding:"2%"}}>
            
            <View>
            {photoURL !== "" && (
              <Avatar
              rounded
              source={{
                uri: photoURL
                  ? photoURL
                  : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
              }}
              size="xlarge"
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
            </View>
            <View style={{marginTop:5, justifyContent:"center"}}>
            {view ?
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity  style={{ marginRight:5}} onPress={handlePickImage} ><Text style={{color:"#276b9c"}}>Pick Image</Text></TouchableOpacity>
              <Text>|</Text>
              <TouchableOpacity  style={{ marginLeft:5}} onPress={handleUpload}><Text style={{color:"#276b9c"}}>Upload Image</Text></TouchableOpacity>
            </View>  
            :          
            <TouchableOpacity  style={{ marginRight:2}} onPress={()=>setView(true)} ><Text style={{color:"#276b9c"}}>Edit</Text></TouchableOpacity>
            }
            </View>            
            </View>
            
            <View style={{ justifyContent:"center", paddingTop:0,padding:"5%", height:"45%", marginBottom:"6%"}}>
              <Text style={{fontWeight:"bold"}}>Name:</Text>
              {view ?
                <TextInput
                style={{borderColor:"gray",borderWidth:1,paddingLeft:5, backgroundColor:"white", height:40, justifyContent:"center", marginTop:5}}
                onChangeText={setDisplayName}
                placeholder="Name"
                value={displayName}
              />
              : 
              <Text style={{height:40, justifyContent:"center", marginTop:5, fontSize:16}}>{displayName}</Text>
              }
              <Text style={{fontWeight:"bold"}}>Email Address:</Text>
              {view?
              <TextInput
              style={{borderColor:"gray",borderWidth:1,paddingLeft:5, backgroundColor:"white", height:40, justifyContent:"center", marginTop:5}}
              onChangeText={setemail}
              placeholder="Email Address"
              value={email}
              disabled
            />
              :
              <Text style={{height:40, justifyContent:"center", marginTop:5, fontSize:16}}>{email}</Text>
              }
              <Text style={{fontWeight:"bold"}}>Phone Number:</Text>

              {view?
              <TextInput
              style={{borderColor:"gray",borderWidth:1,paddingLeft:5, backgroundColor:"white", height:40, justifyContent:"center", marginTop:5}}
              onChangeText={setphoneNumber}
              placeholder="Phone number"
              value={phoneNumber}
        />
              :
              <Text style={{height:40, justifyContent:"center", marginTop:5, fontSize:16}}>{phoneNumber}</Text>

              }
            </View>
            {view &&
            <View style={{justifyContent:"flex-end", height:"10%"}}>
              <TouchableOpacity  style={{backgroundColor:"#276b9c", height:40, justifyContent:"center"}}onPress={handleSave}><Text style={{textAlign:"center", color:"white"}}>Save</Text></TouchableOpacity>
            </View>
            }
            
          </View>
          </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        </View>
        {/* <ScrollView style={styles.container} keyboardShouldPersistTaps="always"> */}
        
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
