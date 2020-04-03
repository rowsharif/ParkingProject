<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  ImageBackground
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import db from "../db";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

const UserProfile = props => {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setemail] = useState("");
  const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uid, setuid] = useState();

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
    // if (uri !== photoURL) {
    //   const response = await fetch(uri);
    //   const blob = await response.blob();
    //   const putResult = await firebase
    //     .storage()
    //     .ref()
    //     .child(firebase.auth().currentUser.uid)
    //     .put(blob);
    //   const url = await firebase
    //     .storage()
    //     .ref()
    //     .child(firebase.auth().currentUser.uid)
    //     .getDownloadURL();
    //   setUri(url);
    //   setPhotoURL(url);
    // }

    // const updateUser = firebase.functions().httpsCallable("updateUser");
    // const response2 = await updateUser({
    //   uid: firebase.auth().currentUser.uid,
    //   displayName,
    //   photoURL: url
    // });
    const updateUser = firebase.functions().httpsCallable("updateUser");
    const response2 = await updateUser({
      uid,
      displayName,
      photoURL: uri,
      email,
      phoneNumber
    });
    // const response2 = await fetch(
    //   `https://us-central1-parkingapp-a7028.cloudfunctions.net/updateUser?uid=${uid}
    // &displayName${displayName}&photoURL${uri}&email${email}&phoneNumber${phoneNumber}`
    // );
    console.log("uuuuuuuuu", uid);
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

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };

  const handleCreate = async () => {};

  const handleDelete = async () => {};

  const handleUpdate = async () => {};
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
         {/* <ScrollView style={styles.container} keyboardShouldPersistTaps="always">  */}
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
            backgroundColor: "#cccccc"
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
        {photoURL !== "" && (
          <Image
            style={{ width: 100, height: 100, margin: "2%" }}
            source={{ uri: photoURL }}
          />
        )}

        <View style={{ margin: "2%" }}>
          <Button title="Pick Image" onPress={handlePickImage} />
        </View>
        <View style={{ margin: "2%" }}>
          <Button title="Upload img" onPress={handleUpload} />
        </View>
        <View style={{ margin: "2%" }}>
          <Button title="Save" onPress={handleSave} />
        </View>
           <View style={{ margin: "2%" }}>
          <Button
            title="handle parking"
            onPress={() => props.navigation.navigate("CRUDParkings")}
          />

        </View>
         <View style={{ margin: "2%" }}>
          <Button
            title="handle parking Lot"
            onPress={() => props.navigation.navigate("CRUDParkingLots")}
          />
          
        </View> 
        
        <View style={{ margin: "2%" }}>
          <Button
            title="handle neartestbuilding"
            onPress={() => props.navigation.navigate("CRUDNearestBuildings")}
          />
          
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Create User"
            onPress={() => props.navigation.navigate("CreateUser")}
          />
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Update User"
            onPress={() => props.navigation.navigate("UpdateUser")}
          />
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Delete User"
            onPress={() => props.navigation.navigate("DeleteUser")}
          />
        </View>
     

         {/* </ScrollView> */}
      </ImageBackground>
    </View>
  );
};

UserProfile.navigationOptions = {
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
export default UserProfile;
const styles = StyleSheet.create({
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
  button: {
    margin: "5%"
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
=======
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  ImageBackground
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import db from "../db";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

const UserProfile = props => {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setemail] = useState("");
  const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uid, setuid] = useState();

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
    // if (uri !== photoURL) {
    //   const response = await fetch(uri);
    //   const blob = await response.blob();
    //   const putResult = await firebase
    //     .storage()
    //     .ref()
    //     .child(firebase.auth().currentUser.uid)
    //     .put(blob);
    //   const url = await firebase
    //     .storage()
    //     .ref()
    //     .child(firebase.auth().currentUser.uid)
    //     .getDownloadURL();
    //   setUri(url);
    //   setPhotoURL(url);
    // }

    // const updateUser = firebase.functions().httpsCallable("updateUser");
    // const response2 = await updateUser({
    //   uid: firebase.auth().currentUser.uid,
    //   displayName,
    //   photoURL: url
    // });
    const updateUser = firebase.functions().httpsCallable("updateUser");
    const response2 = await updateUser({
      uid,
      displayName,
      photoURL: uri,
      email,
      phoneNumber
    });
    // const response2 = await fetch(
    //   `https://us-central1-parkingapp-a7028.cloudfunctions.net/updateUser?uid=${uid}
    // &displayName${displayName}&photoURL${uri}&email${email}&phoneNumber${phoneNumber}`
    // );
    console.log("uuuuuuuuu", uid);
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

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };

  const handleCreate = async () => {};

  const handleDelete = async () => {};

  const handleUpdate = async () => {};
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
         {/* <ScrollView style={styles.container} keyboardShouldPersistTaps="always">  */}
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
            backgroundColor: "#cccccc"
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
        {photoURL !== "" && (
          <Image
            style={{ width: 100, height: 100, margin: "2%" }}
            source={{ uri: photoURL }}
          />
        )}

        <View style={{ margin: "2%" }}>
          <Button title="Pick Image" onPress={handlePickImage} />
        </View>
        <View style={{ margin: "2%" }}>
          <Button title="Upload img" onPress={handleUpload} />
        </View>
        <View style={{ margin: "2%" }}>
          <Button title="Save" onPress={handleSave} />
        </View>
           <View style={{ margin: "2%" }}>
          <Button
            title="handle parking"
            onPress={() => props.navigation.navigate("CRUDParkings")}
          />

        </View>
         <View style={{ margin: "2%" }}>
          <Button
            title="handle parking Lot"
            onPress={() => props.navigation.navigate("CRUDParkingLots")}
          />
          
        </View> 
        
        <View style={{ margin: "2%" }}>
          <Button
            title="handle neartestbuilding"
            onPress={() => props.navigation.navigate("CRUDNearestBuildings")}
          />
          
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Create User"
            onPress={() => props.navigation.navigate("CreateUser")}
          />
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Update User"
            onPress={() => props.navigation.navigate("UpdateUser")}
          />
        </View>
        <View style={{ margin: "2%" }}>
          <Button
            title="Delete User"
            onPress={() => props.navigation.navigate("DeleteUser")}
          />
        </View>
     

         {/* </ScrollView> */}
      </ImageBackground>
    </View>
  );
};

UserProfile.navigationOptions = {
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
export default UserProfile;
const styles = StyleSheet.create({
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
  button: {
    margin: "5%"
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
>>>>>>> 224bd7fd29bd684f0ed5e5bd1526831c2e9d74c7
