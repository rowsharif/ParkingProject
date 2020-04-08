import React,{useState} from 'react';
import { ScrollView, StyleSheet,View,Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

export default function LinksScreen() {
 
  const [nearestBuilding, setNearestBuilding] = useState([
    
  
    { number:"00",name: "Obelisk",latitude:25.359164, longitude:51.479455 },
    { number:"01",name:"Dr Latifa Ibrahim Al-Houty Auditorium Lecture Theatres and Exhibition Hall",latitude:25.358965, longitude:51.480273},
    { number:"02",name:"VIP Entry",latitude:25.359182, longitude:51.480183},
    { number:"03",name:"Administration, Finance, Marketing, Learning Commons, Registrar’s Office and IELTS Testing Centre",latitude:25.358774, longitude:51.480826},
    { number:"04",name:"Student Lounge",latitude:25.358834, longitude:51.481254},
    { number:"05",name:"Language Studies and Academics Classrooms",latitude:25.358888, longitude:51.481890},
    { number:"06",name:"Bookstore and student affairs ",latitude:25.359597, longitude:51.481316},
    { number:"07",name: "School of Language Studies and Academics Faculty Offices",latitude:25.359568, longitude:51.481606 },
    { number:"08",name: "Oil and Gas Training Centre" ,latitude:25.359583, longitude:51.482794},
    { number:"09",name:"School of Engineering Technology",latitude:25.360178, longitude:51.482292},
    { number:"10",name: "School of Information Technology",latitude:25.360490, longitude:51.480302 },
    { number:"11",name: "School of Business Studies Faculty Office",latitude:25.360209, longitude:51.480666 },
    { number:"12",name: "School of Business Studies ",latitude:25.360893, longitude:51.480967 },
    { number:"13",name:"Cafeteria, Male Gymnasium",latitude:25.360832, longitude:51.481632},
    { number:"14",name:"Library ",latitude:25.360771, longitude:51.482029},
    { number:"15",name:"Central Plant",latitude:25.360869, longitude:51.483299},
    { number:"16",name: "Facilities and Campus Services, Shipping and Receiving",latitude:25.360979, longitude:51.482908 },
    { number:"17",name: "Female Recreation Centre",latitude:25.361278, longitude:51.481674 },
    { number:"18",name:" Male Recreation Centre ",latitude:25.360930, longitude:51.482584},
    { number:"19",name: "School of Health Sciences",latitude:25.361209, longitude:51.480200 },
    { number:"20",name:"School of Health Sciences",latitude:25.361201, longitude:51.480774},

    
  ]);

  //normal is 1riyal, silver is 2riyal, gold is 3riyals
  const [parkings2, setParkings2] = useState({});
  const create = async () => {
    db.collection("ParkingLots").onSnapshot((querySnapshot) => {
      const parkingLots = [];
      querySnapshot.forEach((doc) => {
        parkingLots.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current parkingLots: ", parkingLots);
      setParkingLots([...parkingLots]);
    });

    db.collection("NearestBuildings").onSnapshot((querySnapshot) => {
      const nearestBuilding = [];
      querySnapshot.forEach((doc) => {
        nearestBuilding.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current nearestBuilding: ", nearestBuilding);
      setNearestBuilding(nearestBuilding);
    });
  }

  // const create = async () => {
  //   let plot = await db.collection("NearestBuildings").add(NearestBuildings[0]);
  //   parkings1.map(async (parking, i) => {
  //     await db
  //       .collection("ParkingLots")
  //       .doc(plot.id)
  //       .collection("Parkings")
  //       .add(parking);
       
  //   });
  //   NearestBuilding.map(async (parking, i) => {
  //     await db
  //       .collection("ParkingLots")
  //       .doc(plot.id)
  //       .collection("NearestBuildings")
  //       .add(parking);
       
  //   });
  //   console.log("create -----------");
  // };
  const [number, setNumber] = useState("");
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [ParkingLot, setParkingLot] = useState([]);
  const [ParkingLots, setParkingLots] = useState([]);

  const create = async () => {
    db.collection("ParkingLots").onSnapshot((querySnapshot) => {
      const parkingLots = [];
      querySnapshot.forEach((doc) => {
        parkingLots.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current parkingLots: ", parkingLots);
      setParkingLots([...parkingLots]);
    });

    db.collection("NearestBuildings").onSnapshot((querySnapshot) => {
      const nearestBuilding = [];
      querySnapshot.forEach((doc) => {
        nearestBuilding.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current nearestBuilding: ", nearestBuilding);
      setNearestBuilding(nearestBuilding);
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Create" onPress={() => create()} />
    </View>
  );

  // return (
  //   <ScrollView style={styles.container}>
  //     {/**
  //      * Go ahead and delete ExpoLinksView and replace it with your content;
  //      * we just wanted to provide you with some helpful links.
  //      */}
  //     <ExpoLinksView />
  //   </ScrollView>
  // );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
