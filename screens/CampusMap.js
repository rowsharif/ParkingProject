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
import MapViewDirections from "react-native-maps-directions";

export default function CampusMap() {
  const [nearestBuildings, setNearestBuildings] = useState([]);
  const [nearestBuilding, setNearestBuilding] = useState({});
  //Parkings objects as an array to save all the parkings we get from the database to display them
  const [parkings, setParkings] = useState([]);
  //View or not the model that askes the user what service they want and what operation to perform (park, reserve, leave)
  const [modalVisible, setModalVisible] = useState(false);
  //View or not the model that askes the user where the map should go (campus, thire car or their location)
  const [modalVisible2, setModalVisible2] = useState(false);
  //const [ParkingLots, setParkingLots] = useState([]);
  //Parking object to store the parking the user is viewing
  const [parking, setParking] = useState({});
  //Car object to store the user's current car
  const [car, setCar] = useState({});
  //Promotion object to save the promotion object if user enters the correct code for it
  const [promotion, setPromotion] = useState({});
  //Promotions objects as an array to save all the Promotions we get from the database to use as comparison
  const [Promotions, setPromotions] = useState([]);
  //the code string that the user enters
  const [code, setCode] = useState("");
  // Wither the promotion is valid or not
  const [promotionValid, setPromotionValid] = useState("");
  //To store the total amount of the services and the parking amount per hour multiplied with the duration
  const [total, setTotal] = useState(0);
  //To store the duration in houers of the time the user spent in the parking
  const [hours, setHours] = useState(0);
  //to store the user Id
  const [uid, setUid] = useState("");
  //for the user to choose the map Type; eather  "standard" or "satellite"
  const [mapType, setMapType] = useState(true);
  // to store the new region of the map
  const [mapRegion, setMapRegion] = useState({
    latitude: 25.358833,
    longitude: 51.479314,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // to store the user location
  const [location, setLocation] = useState({
    coords: {
      latitude: 25.360766,
      longitude: 51.480378,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });
  // to store the coords of where the user wantes to go to
  const [goTo, setGoto] = useState({
    latitude: 25.358833,
    longitude: 51.479314,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // to store the crew of the parking lot of the parking the user chooses
  const [crew, setCrew] = useState();

  // const setModalvisible = (x) => {
  //   setModalVisible(x);
  //   setPromotionValid("");
  // };

  //  serverless function
  const handleParkings = firebase.functions().httpsCallable("handleParkings");

  // if the user aggres or not to give the app their location
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  //stors all the Services from the database
  const [Services, setServices] = useState([]);
  //to store the Services the user selects
  const [ServicesToAdd, setServicesToAdd] = useState([]);

  // asking the user permition to get thier location
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION); //await for the user respond
    setHasLocationPermission(status === "granted"); //set true if status is granted
  };

  //geting the user location
  const getLocation = async () => {
    const location = await Location.getCurrentPositionAsync({}); //await for the getCurrentPositionAsync function to get the location
    setLocation(location); //setting the user location to the useState variable location
  };

  useEffect(() => {
    //calling the function askPermission
    askPermission();
    //calling the function getLocation
    getLocation();
    //seting the user id
    setUid(firebase.auth().currentUser.uid);
  }, []);

  useEffect(() => {
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
    //initializing an local variable “crew” as empty object “{}”
    let crew = {};
    //checking if the state variable “parking” is not empty and that it has a variable “fk”
    parking &&
      parking.fk &&
      //if the condition is true; it will get the crew of the user chosen parking-> parkingLot from firebase and then save it in the local variable crew
      db
        .collection("ParkingLots")
        .doc(parking.fk) // the ParkingLots of the parking
        .collection("Crew")
        .onSnapshot((querySnapshot) => {
          //onSnapshot Guaranties getting the latest data from the database and keeping the app real-time
          querySnapshot.forEach((doc) => {
            crew = { id: doc.id, ...doc.data(), fk: parking.fk }; // to only store the last crew comming from the database
          });
          //using the function setCrew to change the state variable “crew” to the function local variable “crew”
          setCrew(crew);
        });
    // below is stating when to render; after the state variable “parking” is updated
  }, [parking]);

  useEffect(() => {
    //getting the current car the user is useing
    db.collection("users")
      .doc(firebase.auth().currentUser.uid) //the user id
      .collection("Cars")
      .onSnapshot((querySnapshot) => {
        //Guaranties real-time app
        const Cars = []; // To temporarily store all user cars
        querySnapshot.forEach((doc) => {
          // to add each car to the array while saving the user id as fk
          Cars.push({
            fk: firebase.auth().currentUser.uid,
            id: doc.id,
            ...doc.data(),
          });
        });
        //filtering all the cars came from the database to where the current variable is true; [0] to get the first one. p.s previous code guaranties that only one car can has current as true
        setCar(Cars.filter((c) => c.current === true)[0]);
        //console.log("My car ------", Cars.filter((c) => c.current === true)[0]);
      });
  }, []);

  useEffect(() => {
    //seting the variable totalAmount; this total amount is only for displaying; it will not go to the database
    let totalAmount = 0;

    if (
      car && //if the user has a current car
      car.Parking && // and the car has Parking
      car.Parking.status === 2 && // and the Parking.status is 2 Meaning full
      car.Parking.DateTime // and that the car->parking object has a DateTime object
    ) {
      //Calculating the Duration in hours by subtracting the current date and time from the date and time when the user parked
      const hours = Math.floor(
        Math.abs(
          new Date().getTime() - car.Parking.DateTime.toDate().getTime()
        ) / 36e5
      );
      // pTotal is temp variable used to store the total amount of the parking and services;
      //it equals the number of hours the user spent on the parking multiplied by the parking amount per an hour plus the total amount of all services requested by the user.
      let pTotal = hours * car.Parking.amountperhour + car.Parking.TotalAmount;
      //
      //if the promotionValid is true the totalAmount variable is used to store the totalAmount after discount; otherwise it equals to the ptotal variable
      if (promotionValid === true) {
        totalAmount = pTotal - pTotal * promotion.percent;
      } else {
        totalAmount = pTotal;
      }
      console.log("hours", hours);
      //save the Duration
      setHours(hours);
    }
    //save the total rounded to too dicemal places
    setTotal(Math.round(totalAmount * 100) / 100);
    //update when ever the promotionValid changes
  }, [promotionValid]);

  useEffect(() => {
    //getting all services from database
    db.collection("Services").onSnapshot((querySnapshot) => {
      const Services = [];
      querySnapshot.forEach((doc) => {
        //Guaranties real-time app
        Services.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current Services: ", Services);
      //setting the Services to the state variable Services
      setServices([...Services]);
    });
  }, []);

  useEffect(() => {
    //getting all Promotions from the database
    db.collection("Promotions").onSnapshot((querySnapshot) => {
      //real-time app
      const Promotions = [];
      querySnapshot.forEach((doc) => {
        // to add each Promotion to the array
        Promotions.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current Promotions: ", Promotions);
      //setting the Promotions to the state variable Promotions
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

    //getting all the pakings for a specific ParkingLot
    db.collection("ParkingLots")
      .doc("kECljqmSifLwfkpX6qPy")
      .collection("Parkings")
      .onSnapshot((querySnapshot) => {
        //real-time app
        const parkings = [];
        querySnapshot.forEach((docP) => {
          // to add each Parking to the array whith the ParkingLot id as fk, and name to store the ParkingLot name
          parkings.push({
            fk: "kECljqmSifLwfkpX6qPy",
            name: "C-6",
            id: docP.id,
            ...docP.data(),
          });
        });
        //setting the parkings to the state variable parkings
        setParkings([...parkings]);
      });
  }, []);

  //what to perform when the marker is clicked
  const markerClick = (parking) => {
    //setGoto(mapRegion);
    setGoto({
      latitude: parking.latitude,
      longitude: parking.longitude,
      latitudeDelta: 0.0004,
      longitudeDelta: 0.0004,
    });
    //close the 1st Modal
    setModalVisible(true);
    //set the parking variable to the parking the user clicked on
    setParking(parking);
    //change the PromotionValid to empty. this help with the delay of getting the car-parking object from the database
    setPromotionValid("");
  };

  const handleMapType = () => {
    //changing the map type
    setMapType(!mapType);
    setModalVisible2(false);
  };

  const handleCarParking = async (i, o) => {
    // making a temp variable equal to the parking object the user chaos
    let temp = parking;
    //Changing the state of the parking passed on the operation the user requested
    //0 means Leave or CancelReservation and the parking will be empty status 0, 1 means Reserve status 1, and 2 means Park status 2 parking is full
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
    //close the 1st Modal
    setModalVisible(false);
    //I did not do this part
    handleLocalNotification(i, o);
  };
  //I did not do this part
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

  //adding the Services to the requested user Services
  const handleServicesToAdd = (Service) => {
    //if the service dose not exist in the array
    if (ServicesToAdd.filter((s) => s.id === Service.id).length === 0) {
      //then add it
      setServicesToAdd([...ServicesToAdd, Service]);
    } else {
      //Otherwise  delete it
      setServicesToAdd(ServicesToAdd.filter((s) => s.id !== Service.id));
    }
  };

  const handlePromotion = (code) => {
    //if the code the user enterd matches any code in the promotions came from the database
    //and that the current date and time  is less than the expiry date and time
    if (
      Promotions.filter((p) => p.code === code).length > 0 &&
      new Date().getTime() <
        Promotions.filter((p) => p.code === code)[0]
          .endDateTime.toDate()
          .getTime()
    ) {
      //then set the PromotionValid to true
      setPromotionValid(true);
      // and set the Promotion object to the firet object in the array Promotions that has the same code
      setPromotion(Promotions.filter((p) => p.code === code)[0]);
    } else {
      //Otherwise set the PromotionValid to false
      setPromotionValid(false);
      // and set the Promotion object to empty
      setPromotion({});
    }
  };

  const handleGoto = (x) => {
    //if 0 go to the user parking
    if (x === 0) {
      setGoto({
        latitude: car.Parking.latitude,
        longitude: car.Parking.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      //if x is 2 go to the campus
    } else if (x === 2) {
      setGoto({
        latitude: 25.360766,
        longitude: 51.480378,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    //  Otherwise go to the user location
    else {
      getLocation();
      setGoto({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    //close the 2ed Modal
    setModalVisible2(false);
  };
  const handleMapRegionChange = (mapRegion) => {
    //change the current mapRegion
    setMapRegion(mapRegion);
    //setGoto(mapRegion);
  };
  const setmodalVisible2 = () => {
    //when called it opens the 2ed Modal
    setModalVisible2(true);
    //setGoto(mapRegion);
  };

  return (
    <View style={styles.container}>
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
                  <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={ParkingLot}
                    onValueChange={(itemValue) => setParkingLot(itemValue)}
                  >
                    {ParkingLots.map((ParkingLot, i) => (
                      <Picker.Item label={ParkingLot.name} value={ParkingLot} />
                    ))}
                  </Picker>
                  <TouchableHighlight
                    style={styles.buttonHide}
                    onPress={() => {
                      setModalVisible2(false);
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Go </Text>
                  </TouchableHighlight>
                </View>
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
        {
          // if there is parkings array
          parkings &&
            //display them by looping through the array one object at a time calling it “parking”
            parkings.map((parking) => (
              //Displaying the parking in a marker
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
                    //if the parking type is not normal
                    parking.type !== "normal"
                      ? {
                          borderColor:
                            //if the parking type is gold; show this color
                            parking.type === "gold"
                              ? "#FFD700"
                              : //if the parking type is silver; show this color
                                "#ffffff",
                          borderWidth: 2,
                          backgroundColor:
                            parking.type === "gold" ? "#FFD700" : "#ffffff",
                        }
                      : //if the parking type is  normal
                        {
                          borderColor: "black",
                          borderWidth: 2,
                          backgroundColor: "white",
                        },
                  ]}
                >
                  {
                    //if the parking.status is full
                    parking.status === 2 ? (
                      //if the user has a car & car.Parking is true & car.Parking has id & if the user car.Parking.id equals the current parking id
                      car &&
                      car.Parking &&
                      car.Parking.id &&
                      car.Parking.id === parking.id ? (
                        <Animatable.View
                          animation="rubberBand"
                          iterationCount="infinite"
                          direction="alternate"
                        >
                          {/* display an icon  */}
                          <MaterialCommunityIcons
                            name="car-brake-parking"
                            size={24}
                            color="purple"
                          />
                        </Animatable.View>
                      ) : (
                        //otherwise display red image
                        <Image
                          source={require("../assets/images/red.png")}
                          style={{ width: 22, height: 14 }}
                        />
                      )
                    ) : //if the parking.status is empty display green image
                    parking.status === 0 ? (
                      <Image
                        source={require("../assets/images/green.png")}
                        style={{ width: 22, height: 14 }}
                      />
                    ) : //if the user has a car & car.Parking is true & car.Parking has id & if the user car.Parking.id equals the current parking id car &&
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
                      //if the parking.status is reserved display yellow image
                      <Image
                        source={require("../assets/images/yellow.png")}
                        style={{ width: 22, height: 14 }}
                      />
                    )
                  }
                </View>
              </MapView.Marker>
            ))
        }
        <MapView.Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          pinColor="green"
          title="You are here"
        />
        <MapView.Marker
          coordinate={{
            latitude: 25.358924,
            longitude: 51.480265,
          }}
        >
          <Image
            source={require("../assets/images/1.png")}
            style={{ width: 36, height: 28 }}
          />
        </MapView.Marker>
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
