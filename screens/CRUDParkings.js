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
  View
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handleParkings = firebase.functions().httpsCallable("handleParkings");

export default function HomeScreen() {
  const [parkings, setParkings] = useState([]);
  console.log("---dddd-",parkings)
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setlatitude] = React.useState(0);
  const [amountperhour, setAmountperhour] = React.useState(0);
  const [type, setType] = React.useState("");
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("Parkings").onSnapshot(querySnapshot => {
      const parkings = [];
      console.log("----",parkings)
      querySnapshot.forEach(doc => { 
        parkings.push({ id: doc.id, ...doc.data() });
       
      });
      console.log(" Current parkings: ", parkings);
      setParkings([...parkings]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleParkings({
        parking: { id, longitude, latitude,amountperhour,type },
        operation: "update"
      });
    } else {
      
      const response2 = await handleParkings({
        parking: { id, longitude, latitude,amountperhour,type },
        operation: "add"
      });
    }
    setLongitude("");
    setlatitude("");
    setAmountperhour("");
    setType("");
    setId("");
  };

  const handleEdit = parking => {
    setlatitude(parking.latitude);
    setLongitude(parking.longitude);
    setAmountperhour(parking.amountperhour);
    setType(parking.type);
    setId(parking.id);
  };
  const handleDelete = async parking => {
    const response2 = await handleParkings({
      parking: parking,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        {parkings.map((parking, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {parking.latitude} - {parking.longitude} - {parking.amountperhour} - {parking.type}
            </Text>
            <Button title="Edit" onPress={() => handleEdit(parking)} />
            <Button title="X" onPress={() => handleDelete(parking)} />
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setlatitude}
        placeholder="latitude"
        value={latitude}
      />
       <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setLongitude}
        placeholder="longitude"
        value={longitude}
      />
       <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setAmountperhour}
        placeholder="Amountperhour"
        value={amountperhour}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setType}
        placeholder="Type"
        value={type}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
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
