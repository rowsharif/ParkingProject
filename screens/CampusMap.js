import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions,
  Modal
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export default function CampusMap() {
  const [modalVisible, setModalVisible] = useState(false);
  const [parkings, setParkings] = useState([]);
  const [ParkingLots, setParkingLots] = useState([]);
  const [parking, setParking] = useState([]);
  const [location, setLocation] = useState({
    coords: {
      latitude: 25.360766,
      longitude: 51.480378
    }
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    setHasLocationPermission(status === "granted");
  };

  const getLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    askPermission();
    getLocation();
  }, []);

  // useEffect(() => {
  //   //direction
  //   console.log("-------------------", location);
  // }, [location]);

  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then(querySnapshot => {
        const ParkingLots = [];
        const parkings = [];
        querySnapshot.forEach(doc => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Parkings")
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(docP => {
                parkings.push({ fk: doc.id, id: docP.id, ...docP.data() });
              });
              setParkings([...parkings]);
            });
        });
        setParkingLots([...ParkingLots]);
      });
  }, []);

  const markerClick = parking => {
    setModalVisible(true);
    setParking(parking);
  };
  const Park = () => {
    let temp = parking;
    temp.status = 2;
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Parkings")
      .doc(temp.id)
      .update(temp);
    setModalVisible(false);
  };

  const Reserve = () => {
    let temp = parking;
    temp.status = 1;
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Parkings")
      .doc(temp.id)
      .update(temp);
    setModalVisible(false);
  };

  const CancleReservation = () => {
    let temp = parking;
    temp.status = 0;
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Parkings")
      .doc(temp.id)
      .update(temp);
    setModalVisible(false);
  };

  const Leave = () => {
    let temp = parking;
    temp.status = 0;
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Parkings")
      .doc(temp.id)
      .update(temp);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        style={styles.mapStyle}
        initialRegion={{
          latitude: 25.358833,
          longitude: 51.479314,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }}
        mapType="satellite"
        minZoomLevel={18}
        moveOnMarkerPress={false}
      >
        {parkings &&
          parkings.map(parking => (
            <MapView.Marker
              key={parking.id + parking.fk}
              coordinate={{
                latitude: parking.latitude,
                longitude: parking.longitude
              }}
              pinColor="green"
              onPress={() => markerClick(parking)}
            >
              <Image
                source={
                  parking.status === 2
                    ? require("../assets/images/red.png")
                    : parking.status === 0
                    ? require("../assets/images/green.png")
                    : require("../assets/images/yellow.png")
                }
                style={{ width: 18, height: 10 }}
              />
            </MapView.Marker>
          ))}
      </MapView>
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          key={parking.id}
        >
          <View style={{ marginTop: 22 }}>
            <View
              style={{
                marginTop: 22,
                backgroundColor: "white",
                margin: "20%",
                padding: "5%"
              }}
            >
              <Text>{parking.id}</Text>

              {parking.status === 1 ? (
                <View>
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      Park();
                    }}
                  >
                    <Text>Park</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      CancleReservation();
                    }}
                  >
                    <Text>Cancel Reservation</Text>
                  </TouchableHighlight>
                </View>
              ) : parking.status === 2 ? (
                <TouchableHighlight
                  style={styles.button}
                  onPress={() => {
                    Leave();
                  }}
                >
                  <Text>Leave</Text>
                </TouchableHighlight>
              ) : (
                <View>
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      Park();
                    }}
                  >
                    <Text>Park</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      Reserve();
                    }}
                  >
                    <Text>Reserve</Text>
                  </TouchableHighlight>
                </View>
              )}

              <TouchableHighlight
                style={styles.buttonHide}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text>X</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

CampusMap.navigationOptions = {
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
  button: {
    backgroundColor: "#d6fffc"
  },
  buttonHide: {
    width: "7%",
    backgroundColor: "red"
  },
  markerClick: {
    backgroundColor: "white",
    width: 150,
    height: 200
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
