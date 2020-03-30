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
import { CheckBox } from "react-native-elements";

export default function CampusMap() {
  const [modalVisible, setModalVisible] = useState(false);
  const [parkings, setParkings] = useState([]);
  const [ParkingLots, setParkingLots] = useState([]);
  const [parking, setParking] = useState([]);
  const [car, setCar] = useState([]);
  const [promotion, setPromotion] = useState({});
  const [Promotions, setPromotions] = useState([]);
  const [code, setCode] = useState("");
  const [promotionValid, setPromotionValid] = useState("");
  const [total, setTotal] = useState(0);
  const [hours, setHours] = useState(0);
  //  serverless function
  const handleParkings = firebase.functions().httpsCallable("handleParkings");

  const [location, setLocation] = useState({
    coords: {
      latitude: 25.360766,
      longitude: 51.480378
    }
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [Services, setServices] = useState([]);
  const [ServicesToAdd, setServicesToAdd] = useState([]);

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
    setPromotionValid(" ");
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cars")
      .onSnapshot(querySnapshot => {
        const Cars = [];
        querySnapshot.forEach(doc => {
          Cars.push({
            fk: firebase.auth().currentUser.uid,
            id: doc.id,
            ...doc.data()
          });
        });
        setCar(Cars.filter(c => c.current === true)[0]);
        console.log("My car ------", Cars.filter(c => c.current === true)[0]);
      });
  }, []);

  useEffect(() => {
    let totalAmount = 0;
    if (car.Parking && car.Parking.DateTime) {
      const hours = Math.floor(
        Math.abs(
          new Date().getTime() - car.Parking.DateTime.toDate().getTime()
        ) / 36e5
      );
      let pTotal = hours * car.Parking.amountperhour + car.Parking.TotalAmount;
      if (promotionValid === true) {
        totalAmount = pTotal - pTotal * promotion.percent;
      } else {
        totalAmount = pTotal;
      }
      console.log("hours", hours);
      setHours(hours);
    }

    setTotal(totalAmount);
  }, [promotionValid]);

  useEffect(() => {
    db.collection("Services").onSnapshot(querySnapshot => {
      const Services = [];
      querySnapshot.forEach(doc => {
        Services.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current Services: ", Services);
      setServices([...Services]);
    });
  }, []);

  useEffect(() => {
    db.collection("Promotions").onSnapshot(querySnapshot => {
      const Promotions = [];
      querySnapshot.forEach(doc => {
        Promotions.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current Promotions: ", Promotions);
      setPromotions([...Promotions]);
    });
  }, []);

  // useEffect(() => {
  //   //direction
  //   console.log("-------------------", location);
  // }, [location]);

  useEffect(() => {
    // db.collection("ParkingLots")
    //   .get()
    //   .then(querySnapshot => {
    //     const ParkingLots = [];
    //     let allParkings = [];
    //     querySnapshot.forEach(doc => {
    //       ParkingLots.push({ id: doc.id, ...doc.data() });
    //       db.collection("ParkingLots")
    //         .doc(doc.id)
    //         .collection("Parkings")
    //         .onSnapshot(querySnapshot => {
    //           const nparkings = [];
    //           allParkings = allParkings.filter(p => p.fk !== doc.id);
    //           querySnapshot.forEach(docP => {
    //             nparkings.push({ fk: doc.id, id: docP.id, ...docP.data() });
    //           });
    //           allParkings = [...allParkings, ...nparkings];
    //           setParkings([...allParkings]);
    //         });
    //     });
    //     setParkingLots([...ParkingLots]);
    //   });

    db.collection("ParkingLots")
      .doc("kECljqmSifLwfkpX6qPy")
      .collection("Parkings")
      .onSnapshot(querySnapshot => {
        const parkings = [];
        querySnapshot.forEach(docP => {
          parkings.push({
            fk: "kECljqmSifLwfkpX6qPy",
            id: docP.id,
            ...docP.data()
          });
        });
        setParkings([...parkings]);
      });
  }, []);

  const markerClick = parking => {
    setModalVisible(true);
    setParking(parking);
  };

  const Park = async () => {
    let temp = parking;
    temp.status = 2;
    let crew = {};
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Crew")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          crew = { id: doc.id, ...doc.data() };
        });
      });

    const response2 = await handleParkings({
      temp,
      car,
      ServicesToAdd,
      promotion,
      crew,
      hours,
      operation: "Park"
    });

    setModalVisible(false);
  };

  const Reserve = async () => {
    let temp = parking;
    temp.status = 1;
    let crew = {};
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Crew")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          crew = { id: doc.id, ...doc.data() };
        });
      });

    const response2 = await handleParkings({
      temp,
      car,
      ServicesToAdd,
      promotion,
      crew,
      hours,
      operation: "Reserve"
    });

    setModalVisible(false);
  };

  const Leave = async i => {
    let temp = parking;
    temp.status = 0;
    let crew = {};
    db.collection("ParkingLots")
      .doc(temp.fk)
      .collection("Crew")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          crew = { id: doc.id, ...doc.data() };
        });
      });

    const response2 = await handleParkings({
      temp,
      car,
      ServicesToAdd,
      promotion,
      crew,
      hours,
      operation: i ? "Leave" : "CancelReservation"
    });

    setModalVisible(false);
  };

  const handleServicesToAdd = Service => {
    if (ServicesToAdd.filter(s => s.id === Service.id).length === 0) {
      setServicesToAdd([...ServicesToAdd, Service]);
    } else {
      setServicesToAdd(ServicesToAdd.filter(s => s.id !== Service.id));
    }
  };

  const handlePromotion = code => {
    if (
      Promotions.filter(p => p.code === code).length > 0 &&
      new Date().getTime() <
        Promotions.filter(p => p.code === code)[0]
          .endDateTime.toDate()
          .getTime()
    ) {
      setPromotionValid(true);
      setPromotion(Promotions.filter(p => p.code === code)[0]);
    } else {
      setPromotionValid(false);
      setPromotion({});
    }
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
                    ? car.Parking &&
                      car.Parking.id &&
                      car.Parking.id === parking.id
                      ? require("../assets/images/yourCar.jpg")
                      : require("../assets/images/red.png")
                    : parking.status === 0
                    ? require("../assets/images/green.png")
                    : car.Parking &&
                      car.Parking.id &&
                      car.Parking.id === parking.id
                    ? require("../assets/images/reserved.jpg")
                    : require("../assets/images/yellow.png")
                }
                style={
                  car.Parking && car.Parking.id && car.Parking.id === parking.id
                    ? { width: 45, height: 35 }
                    : { width: 18, height: 10 }
                }
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
          <View style={{ marginTop: 22}}>
            <View
              style={{
                marginTop: 22,
                backgroundColor: "#3c78a3",
                margin: "15%",
                padding: "5%",
                // paddingTop: "1%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                ...Platform.select({
                  ios: {
                    paddingTop: 0,
                    margin: "25%",
                    minHeight: 300
                  },
                  android: {
                    minHeight:
                    200,

                  }
              })}}
            >
              {/* <Text>{parking.id}</Text> */}

              {parking.status === 1
                ? car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id && (
                    <View style={{flexDirection:"row", alignItems: "center", justifyContent:"center", width:"100%"}}>
                      <TouchableHighlight
                        style={styles.buttonGreen}
                        onPress={() => {
                          Park();
                        }}
                      >
                        <Text>Park</Text>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={styles.buttonRed}
                        onPress={() => {
                          Leave(false);
                        }}
                      >
                        <Text style={{textAlign:"center"}}>Cancel Reservation</Text>
                      </TouchableHighlight>
                    </View>
                  )
                : parking.status === 2
                ? car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id && (
                    <View style={{ alignItems: "center", justifyContent:"center", width:"100%"}}>
                      <TextInput
                        style={{
                          height: 40,
                          borderColor: "gray",
                          borderWidth: 1,
                          width:"90%",
                          textAlign:"center",
                          marginTop:"5%",
                          backgroundColor:"white"
                        }}
                        onChangeText={setCode}
                        onSubmitEditing={() => handlePromotion(code)}
                        placeholder="Promotion"
                        value={code}
                      />
                      {promotionValid === true ? (
                        <Text>The promotion is valid</Text>
                      ) : promotionValid === false ? (
                        <Text>The promotion is NOT valid</Text>
                      ) : (
                        <Text></Text>
                      )}
                      <Text>Total: {total} QR</Text>
                      <TouchableHighlight
                        style={styles.buttonPay}
                        onPress={() => {
                          Leave(true);
                        }}
                      >
                        <Text>Pay & Leave</Text>
                      </TouchableHighlight>
                    </View>
                  )
                : car.Parking &&
                  !car.Parking.id && (
                    <View>
                      {Services && 
                          <Text style={{textAlign:"center"}}>Add Services: </Text>
                          }
                      <View style={{alignItems:"center"}}>                        
                      {Services &&
                        Services.map(Service => (
                          <CheckBox
                            center
                            title={
                              <Text style={{width: "90%"}}>
                                {Service.name}
                                <Text>: {Service.price} QR</Text>
                              </Text>
                            }
                            key={Service.id}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={
                              ServicesToAdd.filter(s => s.id === Service.id)
                                .length !== 0
                            }
                            onPress={() => handleServicesToAdd(Service)}
                          />
                        ))}
                        </View>
                      <View style={{flexDirection:"row", alignItems: "center", justifyContent:"center", width:"100%"}}>
                      <TouchableHighlight
                        style={styles.buttonGreen}
                        onPress={() => {
                          Park();
                        }}
                      >
                        <Text>Park</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={styles.buttonYellow}
                        onPress={() => {
                          Reserve();
                        }}
                      >
                        <Text>Reserve</Text>
                      </TouchableHighlight>
                      </View>
                    </View>
                  )}
              <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>              
              <TouchableHighlight
                style={styles.buttonHide}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={{textAlign:"center"}}>Cancel</Text>
              </TouchableHighlight>
              </View>
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
  buttonGreen: {
    backgroundColor: "#5dba68",
    width: "45%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 2,
    borderRadius: 5
    },
    buttonYellow: {
      backgroundColor: "#d1cd56",
      width: "45%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      padding: 2,
      borderRadius: 5
      },
      buttonRed: {
        backgroundColor: "#eb5a50",
        width: "45%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 2,
        borderRadius: 5
        },
    buttonPay: {
        backgroundColor: "#5dba68",
        width: "95%",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        padding: 2,
        borderRadius: 5
        },
  buttonHide: {
    width: "95%",
    height: 30,
    backgroundColor: "#b5b5b0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,    
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
