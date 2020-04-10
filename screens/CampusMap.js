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
import { Rating, AirbnbRating } from "react-native-ratings";

//importing Animatable from react-native-animatable which is a declarative transitions and animations for React Native
import * as Animatable from "react-native-animatable";
import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { CheckBox, Badge } from "react-native-elements";
import { Notifications } from "expo";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome5Brands,
} from "@expo/vector-icons";
console.disableYellowBox = true;

export default function CampusMap() {
  const [nearestBuildings, setNearestBuildings] = useState([]);
  const [nearestBuilding, setNearestBuilding] = useState({ name: "select" });
  //Parkings objects as an array to save all the parkings we get from the database to display them
  const [parkings, setParkings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [number, setNumber] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [crews, setCrews] = useState([]);

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
  const [user, setUser] = useState({});
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
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });
  const [goTo, setGoto] = useState({
    latitude: 25.358833,
    longitude: 51.479314,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [crew, setCrew] = useState();

  const setModalvisible = (x) => {
    setModalVisible(x);
    setPromotionValid("");
  };

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
    setPromotionValid(" ");
    askPermission();
    getLocation();
    setUid(firebase.auth().currentUser.uid);
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        const user = { id: doc.id, ...doc.data() };
        setUser(user);
        console.log("USERS", user);
      });
    db.collection("NearestBuildings").onSnapshot((querySnapshot) => {
      const nearestBuildings = [];
      querySnapshot.forEach((doc) => {
        nearestBuildings.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current nearestBuildings: ", nearestBuildings);
      setNearestBuildings(nearestBuildings);
    });
  }, []);

  useEffect(() => {
    let crew = {};
    parking &&
      parking.fk &&
      db
        .collection("ParkingLots")
        .doc(parking.fk)
        .collection("Crew")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            crew = { id: doc.id, ...doc.data(), fk: parking.fk };
          });
          setCrew(crew);
        });
  }, [parking]);

  ////ranking
  useEffect(() => {
    db.collection("Ratings").onSnapshot((querySnapshot) => {
      const ratings = [];
      querySnapshot.forEach((doc) => {
        ratings.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current ratings: ", ratings);
      setRatings([...ratings]);
    });
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid) //the user id
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
      let pTotal =
        user.role === "staff" ? hours * car.Parking.amountperhour : 0;

      pTotal = pTotal + car.Parking.TotalAmount;

      if (promotionValid === true) {
        totalAmount = pTotal - pTotal * promotion.percent;
      } else {
        totalAmount = pTotal;
      }
      console.log("hours", hours);
      setHours(hours);
    }
    setTotal(Math.round(totalAmount * 100) / 100);
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
    //the below code is not used in this stage; it gets all the pakings from all ParkingLots
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
    //             nparkings.push({ fk: doc.id, name: doc.data().name, id: docP.id, ...docP.data() });
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
            name: "C-6",
            id: docP.id,
            ...docP.data(),
          });
        });
        setParkings([...parkings]);
      });
    db.collection("ParkingLots").onSnapshot((querySnapshot) => {
      const ParkingLots = [];
      querySnapshot.forEach((doc) => {
        ParkingLots.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(" Current ParkingLots: ", ParkingLots);
      setParkingLots([...ParkingLots]);
    });
  }, []);

  const markerClick = (parking) => {
    setGoto({
      latitude: parking.latitude,
      longitude: parking.longitude,
      latitudeDelta: 0.0004,
      longitudeDelta: 0.0004,
    });
    setModalvisible(true);
    setParking(parking);
  };

  const handleMapType = () => {
    setMapType(!mapType);
    setModalVisible2(false);
  };

  const handleCarParking = async (i, o) => {
    let temp = parking;
    temp.status = i;
    //Call the function handleParkings
    // temp= The parking object involved in operations,
    // car= The user car object,
    // promotion= object that contains a discount percentage
    // ServicesToAdd= services The user want to be completed,
    //crew= Which crew to add the services to complete to
    // operation= the operation the user want to do "Leave", "park", "Reserve", or "CancelReservation" of a parking
    // hours = number of hours the user was parked for
    const response2 = await handleParkings({
      uid,
      role: user.role,
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
    i === 0 && o && setModalVisible3(true);
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
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else if (x === 2) {
      setGoto({
        latitude: 25.360766,
        longitude: 51.480378,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else if (x === 3) {
      setGoto({
        latitude: nearestBuilding.ParkingLot.latitude,
        longitude: nearestBuilding.ParkingLot.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      getLocation();
      setGoto({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    setModalVisible2(false);
  };
  const handleMapRegionChange = (mapRegion) => {
    setMapRegion(mapRegion);
    //setGoto(mapRegion);
  };
  const setmodalVisible2 = () => {
    setModalVisible2(true);
    //setGoto(mapRegion);
  };

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
    setNumber(rating);
  };
  const submitRating = async () => {
    const response = await fetch(
      `https://us-central1-parkingapp-a7028.cloudfunctions.net/handleRating?number=${number}&id=${crew.id}&fk=${crew.fk}&name=${crew.name}`
    );
    setModalVisible3(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible3}
          onRequestClose={() => {
            setModalVisible3(false);
          }}
          key={ratings.id}
        >
          <View style={{ marginTop: 22 }}>
            {/* <View
    style={{
      margin: "20%",
      backgroundColor: "white",
      height: 230,
      color:"white"
    }}
  > */}

            <View
              style={{
                //marginTop: 15,
                backgroundColor: "#3c78a3",
                margin: "15%",
                //padding: "5%",
                //paddingTop: "1%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                ...Platform.select({
                  ios: {
                    paddingTop: 10,
                    margin: "25%",
                    minHeight: 300,
                    width: "60%",
                  },
                  android: {
                    minHeight: 227,
                  },
                }),
              }}
            >
              <View style={{ alignSelf: "flex-end", width: "10%" }}>
                <TouchableHighlight
                  style={[styles.buttonHide, { width: "90%", marginTop: 0 }]}
                  onPress={() => {
                    setModalVisible3(false);
                  }}
                >
                  <Text>X</Text>
                </TouchableHighlight>
              </View>
              <Text style={styles.getStartedText}>Rate Our Crew</Text>

              <AirbnbRating
                count={5}
                reviews={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                defaultRating="1"
                minValue={1}
                size={20}
                onFinishRating={ratingCompleted}
              />
              <TouchableHighlight
                style={styles.buttonGreen}
                onPress={() => {
                  submitRating();
                }}
              >
                <Text>Submit</Text>
              </TouchableHighlight>
            </View>

            {/* </View> */}
          </View>
        </Modal>
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
                margin: "10%",
                backgroundColor: "gray",
                height: 440,
                padding: 10,
              }}
            >
              {car.Parking && car.Parking.id ? (
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
              ) : (
                <Animatable.View
                  animation="fadeInLeft"
                  iterationCount={1}
                  direction="alternate"
                >
                  <TouchableHighlight
                    style={styles.buttonGreen}
                    onPress={() => {
                      handleGoto(2);
                    }}
                  >
                    <Text>Go to Campus</Text>
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
                  <Text style={{ textAlign: "center" }}>
                    Go to the parkign lot next to building...{" "}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 15,
                      justifyContent: "center",
                    }}
                  >
                    {nearestBuildings.map((nearestBuilding, i) => (
                      <View
                        key={i}
                        style={{ width: "14%", height: 25, padding: 0 }}
                      >
                        <Badge
                          containerStyle={{ position: "absolute" }}
                          value={<Text>{nearestBuilding.number}</Text>}
                          status="warning"
                          onPress={() => setNearestBuilding(nearestBuilding)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
                {nearestBuilding.ParkingLot && (
                  <TouchableHighlight
                    style={styles.buttonYellow}
                    onPress={() => {
                      handleGoto(3);
                    }}
                  >
                    <Text>Go: {nearestBuilding.name}</Text>
                  </TouchableHighlight>
                )}
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
          latitudeDelta: goTo.latitudeDelta,
          longitudeDelta: goTo.longitudeDelta,
        }}
        mapType={mapType ? "satellite" : "standard"}
        minZoomLevel={18}
        loadingEnable={true}
        moveOnMarkerPress={false}
        onLongPress={() => setmodalVisible2(true)}
        onRegionChange={() => handleMapRegionChange()}
        //rotateEnabled={false}
        // pitchEnabled={false}
        // toolbarEnabled={false}
      >
        {/* <MapViewDirections
          origin={location}
          destination={{ latitude: "25.360785", longitude: "51.478388" }}
          apikey={"AIzaSyBRHnzLFv5McdodhkYLZ2sjxOxuO-mzatw"}
          // strokeWidth={3}
          // strokeColor="hotpink"
        /> */}
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
                    <Animatable.View
                      animation="rubberBand"
                      iterationCount="infinite"
                      direction="alternate"
                    >
                      <MaterialCommunityIcons
                        name="car-brake-parking"
                        size={24}
                        color="purple"
                      />
                    </Animatable.View>
                  ) : (
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
                ) : car.Parking &&
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
        {ParkingLots &&
          ParkingLots.map((ParkingLot, i) => (
            <MapView.Marker
              coordinate={{
                latitude: ParkingLot.latitude,
                longitude: ParkingLot.longitude,
              }}
            >
              <Image
                source={{ uri: ParkingLot.img }}
                style={{ width: 40, height: 30 }}
              />
              {ratings.filter((r) => r.crew.fk === ParkingLot.id).length >
                0 && (
                <Rating
                  imageSize={10}
                  readonly
                  fractions="{1}"
                  startingValue={
                    ratings
                      .filter((r) => r.crew.fk === ParkingLot.id)
                      .reduce(
                        (previousScore, currentScore, index) =>
                          previousScore + parseInt(currentScore.number),
                        0
                      ) /
                    ratings.filter((r) => r.crew.fk === ParkingLot.id).length
                  }
                />
              )}
            </MapView.Marker>
          ))}
        {nearestBuildings &&
          nearestBuildings.map((nearestBuilding) => (
            <MapView.Marker
              coordinate={{
                latitude: nearestBuilding.latitude,
                longitude: nearestBuilding.longitude,
              }}
            >
              <Image
                source={{ uri: nearestBuilding.img }}
                style={{ width: 40, height: 30 }}
              />
            </MapView.Marker>
          ))}
        <MapView.Marker
          coordinate={{
            latitude: 25.359997,
            longitude: 51.480268,
          }}
        >
          <Image
            source={require("../assets/images/blueFlag.png")}
            style={{ width: 36, height: 28 }}
          />
        </MapView.Marker>
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
                      {Services && crew && (
                        <View>
                          <Text style={{ textAlign: "center" }}>
                            Crew Rating
                          </Text>
                          {ratings.filter((r) => r.crew.id === crew.id).length >
                            0 && (
                            <Rating
                              imageSize={20}
                              readonly
                              fractions="{1}"
                              startingValue={
                                ratings
                                  .filter((r) => r.crew.id === crew.id)
                                  .reduce(
                                    (previousScore, currentScore, index) =>
                                      previousScore +
                                      parseInt(currentScore.number),
                                    0
                                  ) /
                                ratings.filter((r) => r.crew.id === crew.id)
                                  .length
                              }
                            />
                          )}
                          <Text style={{ textAlign: "center" }}>
                            Add Services:{" "}
                          </Text>
                        </View>
                      )}
                      <View style={{ alignItems: "center" }}>
                        {
                          //if there is an array of Services
                          Services &&
                            //maping through all Services and giving the user a way to choose which service to add /request
                            Services.map((Service) => (
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
                                  //check if the Service exist in the ServicesToAdd array (services the user chaos ); true or false
                                  ServicesToAdd.filter(
                                    (s) => s.id === Service.id
                                  ).length !== 0
                                }
                                onPress={() => handleServicesToAdd(Service)} //when clicked it goes to the function handleServicesToAdd to add or delete the service
                              />
                            ))
                        }
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
  // getStartedText: {
  //   fontSize: 24,
  //   color: "rgba(96,100,109, 1)",
  //   lineHeight: 24,
  //   textAlign: "center",
  // },
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
