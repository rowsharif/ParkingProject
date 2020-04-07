import * as WebBrowser from "expo-web-browser";
// importing useState and useEffect from react
import React, { useState, useEffect } from "react"; // React needs to be imported
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
  Modal,
} from "react-native";
//importing Animatable from react-native-animatable which is a declarative transitions and animations for React Native
import * as Animatable from "react-native-animatable";
import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { CheckBox } from "react-native-elements";
import { Notifications } from "expo";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome5Brands,
} from "@expo/vector-icons";

export default function CampusMap() {
  // React Hooks are functions that allow the use of React state and a
  // component's lifecycle methods in a functional component
  // useState and useEffect are built-in Hooks
  const [parkings, setParkings] = useState([]);
  // Above is declare a new state variable, which we'll call "parking" as a const ;
  // setParkings is a function that we use to change (set) the value of parkings;
  // the initial value of parkings is []; which is an empty array
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [ParkingLots, setParkingLots] = useState([]);
  const [parking, setParking] = useState({});
  const [car, setCar] = useState({});
  const [promotion, setPromotion] = useState({});
  const [Promotions, setPromotions] = useState([]);
  const [code, setCode] = useState("");
  const [promotionValid, setPromotionValid] = useState("");
  const [total, setTotal] = useState(0);
  const [hours, setHours] = useState(0);
  const [uid, setUid] = useState("");
  const [mapType, setMapType] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 25.358833,
    longitude: 51.479314,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState({
    coords: {
      latitude: 25.360766,
      longitude: 51.480378,
    },
  });

  const [goTo, setGoto] = useState({
    latitude: 25.358833,
    longitude: 51.479314,
  });

  const [crew, setCrew] = useState();

  const setModalvisible = (x) => {
    setModalVisible(x);
    setPromotionValid("");
  };
  //  serverless function
  const handleParkings = firebase.functions().httpsCallable("handleParkings");

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
    setUid(firebase.auth().currentUser.uid);
  }, []);

  //useEffect Hook tells React that the component needs to do something after render
  //React will remember the function passed and call it later after performing the updates
  //placing useEffect inside the component allows access to the state’s variables (parking, crew)
  //by default, it runs both after the first render and after every update.
  //The below useEffect will run after the first render and whenever the state variable “parking” changes.
  useEffect(() => {
    //initializing an local variable “crew” as empty object “{}”
    let crew = {};
    //checking if the state variable “parking” is not empty and that it has a variable “fk”
    parking &&
      parking.fk &&
      //if the condition is true; we’ll get the crew of the parking parkingLot from firebase and then save it in the local variable crew
      db
        .collection("ParkingLots")
        .doc(parking.fk)
        .collection("Crew")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            crew = { id: doc.id, ...doc.data() };
          });
          //using the function setCrew to change the state variable “crew” to the function local variable “crew”
          setCrew(crew);
        });
    // below is stating when to render; after the state variable “parking” is updated
  }, [parking]);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cars")
      .onSnapshot((querySnapshot) => {
        const Cars = [];
        querySnapshot.forEach((doc) => {
          Cars.push({
            fk: firebase.auth().currentUser.uid,
            id: doc.id,
            ...doc.data(),
          });
        });
        setCar(Cars.filter((c) => c.current === true)[0]);
        setPromotionValid(" ");
        console.log("My car ------", Cars.filter((c) => c.current === true)[0]);
      });
  }, []);

  useEffect(() => {
    let totalAmount = 0;
    if (
      car &&
      car.Parking &&
      car.Parking.status === 2 &&
      car.Parking.DateTime
    ) {
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

    setTotal(Math.floor(totalAmount));
  }, [promotionValid]);

  useEffect(() => {
    db.collection("Services").onSnapshot((querySnapshot) => {
      const Services = [];
      querySnapshot.forEach((doc) => {
        Services.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current Services: ", Services);
      setServices([...Services]);
    });
  }, []);

  useEffect(() => {
    db.collection("Promotions").onSnapshot((querySnapshot) => {
      const Promotions = [];
      querySnapshot.forEach((doc) => {
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
      .onSnapshot((querySnapshot) => {
        const parkings = [];
        querySnapshot.forEach((docP) => {
          parkings.push({
            fk: "kECljqmSifLwfkpX6qPy",
            id: docP.id,
            ...docP.data(),
          });
        });
        setParkings([...parkings]);
      });
  }, []);

  const markerClick = (parking) => {
    setGoto(mapRegion);
    setModalVisible(true);
    setParking(parking);
    console.log("goTo+++++++++++", goTo);
  };

  const handleMapType = () => {
    setMapType(!mapType);
    setModalVisible2(false);
  };

  const handleCarParking = async (i, o) => {
    let temp = parking;
    temp.status = i;
    const response2 = await handleParkings({
      uid,
      temp,
      car,
      ServicesToAdd,
      promotion,
      crew,
      hours,
      operation:
        i === 0
          ? o
            ? "Leave"
            : "CancelReservation"
          : i === 1
          ? "Reserve"
          : "Park",
    });
    setModalVisible(false);
    handleLocalNotification(i, o);
  };
  const handleLocalNotification = (i, o) => {
    let title = "";
    let body = "";

    let localNotification = {
      title: null,
      body: null,
      ios: {
        sound: true,
        _displayInForeground: true,
      },
      android: {
        icon:
          "https://med.virginia.edu/cme/wp-content/uploads/sites/262/2015/10/free-vector-parking-available-sign-clip-art_116878_Parking_Available_Sign_clip_art_hight.png",
        color: "#276b9c",
        vibrate: true,
      },
    };
    if (i === 2 && o === true) {
      title = "Parked!";
      body = `You have successfully parked your car! (Plate No. ${car.PlateNumber})`;
    } else if (i === 1 && o === true) {
      title = "Reserved!";
      body = `The parking space is reserved for your car! (Plate No. ${car.PlateNumber})`;
    } else if (i === 0 && o === false) {
      title = "Reservation Cancelled!";
      body = `The reservation is cancelled for your car! (Plate No. ${car.PlateNumber})`;
    } else {
      title = `Thank You ${firebase.auth().currentUser.displayName}!`;
      body = `Thank you for parking, see you soon! (Plate No. ${car.PlateNumber})`;
    }

    localNotification.title = title;
    localNotification.body = body;
    Notifications.presentLocalNotificationAsync(localNotification);
  };

  const handleServicesToAdd = (Service) => {
    if (ServicesToAdd.filter((s) => s.id === Service.id).length === 0) {
      setServicesToAdd([...ServicesToAdd, Service]);
    } else {
      setServicesToAdd(ServicesToAdd.filter((s) => s.id !== Service.id));
    }
  };

  const handlePromotion = (code) => {
    if (
      Promotions.filter((p) => p.code === code).length > 0 &&
      new Date().getTime() <
        Promotions.filter((p) => p.code === code)[0]
          .endDateTime.toDate()
          .getTime()
    ) {
      setPromotionValid(true);
      setPromotion(Promotions.filter((p) => p.code === code)[0]);
    } else {
      setPromotionValid(false);
      setPromotion({});
    }
  };

  const handleGoto = (x) => {
    if (x === 0) {
      setGoto({
        latitude: car.Parking.latitude,
        longitude: car.Parking.longitude,
      });
    } else {
      getLocation();
      setGoto({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
    setModalVisible2(false);
  };
  const handleMapRegionChange = (mapRegion) => {
    setMapRegion(mapRegion);
  };
  const setmodalVisible2 = () => {
    setModalVisible2(true);
    setGoto(mapRegion);
  };

  return (
    //View is a container that supports layout
    <View style={styles.container}>
      {/* The Modal component is a basic way to present content above an enclosing view.
        The animationType prop controls how the modal animates. the "slide" value make the modal slides in from the bottom
        The transparent prop determines whether your modal will fill the entire view. Setting this to true will render the modal over a transparent background.
        The visible prop determines whether the modal is visible. its value is a state variable that changes to true or false to show or hide the modal.
        the key prop is used because the modal is inside a map function
        */}
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(false);
          }}
          key={parking.id}
        >
          <View style={{ marginTop: 22 }}>
            <View
              style={{
                margin: "20%",
                backgroundColor: "gray",
                height: 230,
                padding: 10,
              }}
            >
              {car.Parking && car.Parking.id && (
                <Animatable.View
                  animation="fadeInLeft"
                  iterationCount={1}
                  direction="alternate"
                >
                  <TouchableHighlight
                    style={styles.buttonGreen}
                    onPress={() => {
                      handleGoto(0);
                    }}
                  >
                    <Text>Go to my Parking</Text>
                  </TouchableHighlight>
                </Animatable.View>
              )}
              <Animatable.View
                animation="fadeInRight"
                iterationCount={1}
                direction="alternate"
              >
                <TouchableHighlight
                  style={styles.buttonYellow}
                  onPress={() => {
                    handleGoto(1);
                  }}
                >
                  <Text>Go To my Location</Text>
                </TouchableHighlight>
              </Animatable.View>
              <Animatable.View
                animation="fadeInRight"
                iterationCount={1}
                direction="alternate"
              >
                <TouchableHighlight
                  style={styles.buttonGreen}
                  onPress={() => {
                    handleMapType(!mapType);
                  }}
                >
                  <Text>{mapType ? "standard" : "satellite"}</Text>
                </TouchableHighlight>
              </Animatable.View>
              <Animatable.View
                animation="fadeInUp"
                iterationCount={1}
                direction="alternate"
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableHighlight
                    style={styles.buttonHide}
                    onPress={() => {
                      setModalVisible2(false);
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Cancel </Text>
                  </TouchableHighlight>
                </View>
              </Animatable.View>
            </View>
          </View>
        </Modal>
      </View>
      <MapView
        provider="google"
        style={styles.mapStyle}
        region={{
          latitude: goTo.latitude,
          longitude: goTo.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType={mapType ? "satellite" : "standard"}
        minZoomLevel={18}
        moveOnMarkerPress={false}
        moveOnMapViewPress={false}
        onLongPress={() => setmodalVisible2(true)}
        //onRegionChangeComplete={handleMapRegionChange}
        //rotateEnabled={false}
        // pitchEnabled={false}
        // toolbarEnabled={false}
      >
        {parkings &&
          parkings.map((parking) => (
            <MapView.Marker
              key={parking.id + parking.fk}
              coordinate={{
                latitude: parking.latitude,
                longitude: parking.longitude,
              }}
              pinColor="green"
              onPress={() => markerClick(parking)}
            >
              <View
                style={[
                  parking.type !== "normal"
                    ? {
                        borderColor:
                          parking.type === "gold" ? "#FFD700" : "#ffffff",
                        borderWidth: 2,
                        backgroundColor:
                          parking.type === "gold" ? "#FFD700" : "#ffffff",
                      }
                    : {
                        borderColor: "black",
                        borderWidth: 2,
                        backgroundColor: "white",
                      },
                ]}
              >
                {parking.status === 2 ? (
                  car &&
                  car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id ? (
                    //Using Animatable.View To animate the element
                    //choosing the name of the animation inside the prop "animation"
                    //choosing how many times to run the animation inside the prop "iterationCount", useing "infinite" for looped animations.
                    //choosing direction of animation, which is especially useful for repeating animations inside the prop "direction"
                    <Animatable.View
                      animation="rubberBand"
                      iterationCount="infinite"
                      direction="alternate"
                    >
                      {/* The element to be animated is an icon "MaterialCommunityIcons" */}
                      <MaterialCommunityIcons
                        name="car-brake-parking"
                        size={24}
                        color="purple"
                      />
                    </Animatable.View> //closing tag for Animatable
                  ) : (
                    //Image is a React component for displaying different types of images
                    //source prop The image source (either a remote URL or a local file resource). in this case local file
                    <Image
                      source={require("../assets/images/red.png")}
                      style={{ width: 22, height: 14 }}
                    />
                  )
                ) : parking.status === 0 ? (
                  <Image
                    source={require("../assets/images/green.png")}
                    style={{ width: 22, height: 14 }}
                  />
                ) : car &&
                  car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id ? (
                  <Animatable.View
                    animation="flash"
                    iterationCount="infinite"
                    direction="alternate"
                  >
                    <MaterialCommunityIcons
                      name="registered-trademark"
                      size={24}
                      color="purple"
                    />
                  </Animatable.View>
                ) : (
                  <Image
                    source={require("../assets/images/yellow.png")}
                    style={{ width: 22, height: 14 }}
                  />
                )}
              </View>
            </MapView.Marker>
          ))}
        <MapView.Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          pinColor="green"
          title="You are here"
        />
      </MapView>

      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          key={parking.id}
        >
          <View style={{ marginTop: 22 }}>
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
                    paddingTop: 50,
                    margin: "25%",
                    minHeight: 300,
                    width: "60%",
                  },
                  android: {
                    minHeight: 200,
                  },
                }),
              }}
            >
              <Text>
                This Parking is{" "}
                {parking.status === 0
                  ? "Empty"
                  : parking.status === 1
                  ? "Reserved"
                  : "Full"}
              </Text>

              {parking.status === 1
                ? car &&
                  car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Animatable.View
                        animation="fadeInLeft"
                        iterationCount={1}
                        direction="alternate"
                      >
                        <View>
                          {/*A wrapper for making views respond properly to touches 
                           On press down, the opacity of the wrapped view is decreased, which allows the underlay color to show through, darkening or tinting the view.
                           TouchableHighlight must have one child in this case a text component
                           the prop onPress determine the function to use when the TouchableHighlight is pressed
                           the prop style  determine the style of the TouchableHighlight*/}
                          <TouchableHighlight
                            style={styles.buttonGreen}
                            onPress={() => {
                              handleCarParking(2, true);
                            }}
                          >
                            <Text>Park</Text>
                          </TouchableHighlight>
                        </View>
                      </Animatable.View>

                      <Animatable.View
                        animation="fadeInRight"
                        iterationCount={1}
                        direction="alternate"
                      >
                        <View>
                          <TouchableHighlight
                            style={styles.buttonRed}
                            onPress={() => {
                              handleCarParking(0, false);
                            }}
                          >
                            <Text style={{ textAlign: "center" }}>
                              Cancel Reservation
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </Animatable.View>
                    </View>
                  )
                : parking.status === 2
                ? car &&
                  car.Parking &&
                  car.Parking.id &&
                  car.Parking.id === parking.id && (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      {/*TextInput A foundational component for inputting text into the app via a keyboard. */}
                      <TextInput
                        style={{
                          height: 40,
                          borderColor: "gray",
                          borderWidth: 1,
                          width: "90%",
                          textAlign: "center",
                          marginTop: "5%",
                          backgroundColor: "white",
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
                      <Animatable.View
                        animation="fadeInDown"
                        iterationCount={1}
                        direction="alternate"
                      >
                        <View>
                          <TouchableHighlight
                            style={styles.buttonPay}
                            onPress={() => {
                              handleCarParking(0, true);
                            }}
                          >
                            <Text>Pay & Leave</Text>
                          </TouchableHighlight>
                        </View>
                      </Animatable.View>
                    </View>
                  )
                : car &&
                  car.Parking &&
                  !car.Parking.id && (
                    <View>
                      {Services && (
                        <Text style={{ textAlign: "center" }}>
                          Add Services:{" "}
                        </Text>
                      )}
                      <View style={{ alignItems: "center" }}>
                        {Services &&
                          Services.map((Service) => (
                            // CheckBox is from React Native elements
                            // the prop "center" aligns checkbox to center
                            //the prop "title" is the title of checkbox
                            //the prop "checkedIcon" is the checked icon set to "dot-circle-o"
                            //the prop "uncheckedIcon" is the checked icon set to "circle-o"
                            //the prop "checked" is the status of checkbox; true for checked and false for unchecked; checking if the element is inside the state array "ServicesToAdd"
                            //the prop "onPress" is the  function to call when the checkbox is pressed (the function change the value of checked true-false)
                            <CheckBox
                              center
                              title={
                                <Text style={{ width: "90%" }}>
                                  {Service.name}
                                  <Text>: {Service.price} QR</Text>
                                </Text>
                              }
                              key={Service.id}
                              checkedIcon="dot-circle-o"
                              uncheckedIcon="circle-o"
                              checked={
                                ServicesToAdd.filter((s) => s.id === Service.id)
                                  .length !== 0
                              }
                              onPress={() => handleServicesToAdd(Service)}
                            />
                          ))}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Animatable.View
                          animation="fadeInLeft"
                          iterationCount={1}
                          direction="alternate"
                        >
                          <View>
                            <TouchableHighlight
                              style={styles.buttonGreen}
                              onPress={() => {
                                handleCarParking(2, true);
                              }}
                            >
                              <Text>Park</Text>
                            </TouchableHighlight>
                          </View>
                        </Animatable.View>
                        <Animatable.View
                          animation="fadeInRight"
                          iterationCount={1}
                          direction="alternate"
                        >
                          <View>
                            <TouchableHighlight
                              style={styles.buttonYellow}
                              onPress={() => {
                                handleCarParking(1, true);
                              }}
                            >
                              <Text>Reserve</Text>
                            </TouchableHighlight>
                          </View>
                        </Animatable.View>
                      </View>
                    </View>
                  )}
              <Animatable.View
                animation="fadeInUp"
                iterationCount={1}
                direction="alternate"
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableHighlight
                    style={styles.buttonHide}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Cancel </Text>
                  </TouchableHighlight>
                </View>
              </Animatable.View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
//No navigationOptions is needed, the header is null therefor no header will show
CampusMap.navigationOptions = {
  header: null,
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

//A StyleSheet is an abstraction similar to CSS StyleSheets
const styles = StyleSheet.create({
  buttonGreen: {
    backgroundColor: "#5dba68",
    width: "99%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 2,
    borderRadius: 5,
  },
  buttonYellow: {
    backgroundColor: "#d1cd56",
    width: "99%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 2,
    borderRadius: 5,
  },
  buttonRed: {
    backgroundColor: "#eb5a50",
    width: "99%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 2,
    borderRadius: 5,
  },
  buttonPay: {
    backgroundColor: "#5dba68",
    width: "95%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 2,
    borderRadius: 5,
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
    height: 200,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
