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
//import { handleParkings } from "../functions";
const handleNearestBuilding = firebase.functions().httpsCallable("handleNearestBuilding");

export default function HomeScreen() {
  const [nearestBuilding, setNearestBuilding] = useState([]);
  const [number, setNumber] = React.useState(0);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then(querySnapshot => {
        const ParkingLots = [];
        let allNearestBuildings = [];
        querySnapshot.forEach(doc => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("NearestBuildings")
            .onSnapshot(querySnapshot => {
              const nNearestBuildings = [];
              allNearestBuildings = allNearestBuildings.filter(p => p.fk !== doc.id);
              querySnapshot.forEach(docP => {
                nNearestBuildings.push({ fk: doc.id, id: docP.id, ...docP.data() });
              });
              allNearestBuildings = [...allNearestBuildings, ...nNearestBuildings];
              setNearestBuilding([...allNearestBuildings]);
            });
        });
        setParkingLots([...ParkingLots]);
      });
    },[]);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleNearestBuilding({
        nearestBuilding: { id, name, number },
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleNearestBuilding({
        nearestBuilding: { id, name, number },
        operation: "add"
      });
    }
    setName("");
    setNumber("");
    setId("");
  };

  const handleEdit = nearestBuilding => {
    setName(nearestBuilding.name);
    setNumber(nearestBuilding.number);
    setId(nearestBuilding.id);
  };
  const handleDelete = async nearestBuilding => {
    const response2 = await handleNearestBuilding({
      nearestBuilding: nearestBuilding,
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
        {nearestBuilding.map((nearestBuilding, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {nearestBuilding.name} - {nearestBuilding.number} 
            </Text>
            <Button title="Edit" onPress={() => handleEdit(nearestBuilding)} />
            <Button title="X" onPress={() => handleDelete(nearestBuilding)} />
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setNumber}
        placeholder="number"
        value={number}
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