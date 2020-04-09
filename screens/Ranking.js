//@refresh reset
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
  View,
  Picker,
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { Rating, AirbnbRating } from 'react-native-ratings';


const CRUDrankings = (props) => {
  const [rankings, setRankings] = useState([]);
  const [crews, setCrews] = useState([]);
  const [crew, setCrew] = useState({});
  
  const [number,setNumber]=useState()
  
  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        const ParkingLots = [];
        let allCrews = [];
        let allranking = [];
        querySnapshot.forEach((doc) => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot((querySnapshot) => {
              const ncrews = [];
              allCrews = allCrews.filter((p) => p.fk !== doc.id);
              querySnapshot.forEach((docP) => {
                ncrews.push({ fk: doc.id, id: docP.id, ...docP.data() });
                db.collection("ParkingLots")
                  .doc(doc.id)
                  .collection("Crew")
                  .doc(docP.id)
                  .collection("Ranking")
                  .onSnapshot((querySnapshot) => {
                    const nrankings = [];
                    allranking = allranking.filter((p) => p.fk !== docP.id);
                    querySnapshot.forEach((docE) => {
                      nrankings.push({
                        fkp: doc.id,
                        fk: docP.id,
                        crewName: docP.data().name,
                        id: docE.id,
                        ...docE.data(),
                      });
                    });
                    allranking = [...allranking, ...nrankings];
                    setRankings([...allranking]);
                  });
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
              
              console.log("Crews", allCrews);
            });
        });
      });
  }, []);

  const ratingCompleted=(rating) =>{
    
    console.log("Rating is: " + rating)
  }
  const handleSend = async () => {
   
      // call serverless function instead
      const response2 = await handleEmployee({
        employee: { number, fk: crew.id, fkp: crew.fk },
        operation: "add",
      });
      };

  
  
  return (
    <ScrollView>
      <View style={styles.container}>
        {rankings.map((ranking, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {ranking.number} - crew
              Name:{ranking.crewName}
            </Text>  

<Text>{number}</Text>


<AirbnbRating
              count={5}
              reviews={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
              defaultRating="0"
              minValue={1}
              size={20}
              onFinishRating={ratingCompleted}
            />

          </View>
        ))}
       
       
    
        {/* <Button title="Send" onPress={handleSend} />
        <Button
          color="green"
          title="Cancel"
          onPress={() => props.navigation.goBack()}
        ></Button> */}
      </View>
    </ScrollView>
  );
};
CRUDrankings.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          flex: 1,
          paddingTop: 10,
          fontSize: 18,
          fontWeight: "700",
          color: "white",
          textAlign: "center",
        }}
      >
        MyProfile
      </Text>
      <View
        style={{
          flex: 2,
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
};
export default CRUDrankings;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 200,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1,
  },
  pickerItem: {
    color: "red",
  },
});
