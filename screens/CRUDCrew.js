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
import IOSPicker from 'react-native-ios-picker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleCrew = firebase.functions().httpsCallable("handleCrew");

const CRUDCrew = (props) => {
  //crews objects as an array to save all the crews we get from the database to display them
  const [crews, setCrews] = useState([]);
  const [parking, setParking] = useState([]);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [fkp, setFkp] = useState();
  const [pname, setPname] = useState();
  const [pnames, setPnames] = useState([]);

  useEffect(() => {
    //getting all Crews and all ParkingLots
    db.collection("ParkingLots")
      .get()
      .then((querySnapshot) => {
        const ParkingLots = [];
        let allCrews = [];
        querySnapshot.forEach((doc) => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot((querySnapshot) => {
              const ncrews = [];
              allCrews = allCrews.filter((p) => p.fkp !== doc.id);
              querySnapshot.forEach((docP) => {
                ncrews.push({
                  fkp: doc.id,
                  pln: doc.data().name,
                  id: docP.id,
                  ...docP.data(),
                });
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
              // console.log("Crews", allCrews);
              // console.log("Pnames",pnames.name)
              setPnames([...ParkingLots]);
            });
        });
      });
  }, []);

  const handleSend = async () => {
    if (id) {
      if (fkp === pname.id) {
        const response2 = await handleCrew({
          crew: { id, name, fkp },
          operation: "update",
        });
      } else {
        const response2 = await handleCrew({
          crew: { id, name, fkp },
          operation: "delete",
        });
        const response3 = await handleCrew({
          crew: { name, fkp: pname.id },
          operation: "add",
        });
      }
    } else {
      // call serverless function instead
      const response2 = await handleCrew({
        crew: { name, fkp: pname.id },
        operation: "add",
      });
    }

    setName("");

    setId("");
  };

  const handleEdit = (crew) => {
    setName(crew.name);
    setFkp(crew.fkp);

    setId(crew.id);
  };
  //if the user choose to delete the crew the function will be called
  const handleDelete = async (crew) => {
    //it sends the crew to delete as a parameter to the function and the operation as "delete"
    const response2 = await handleCrew({
      crew: crew,
      operation: "delete",
    });
  };
  return (
    <ScrollView style={styles.container}>
      {
        //looping threw all crews array objects; calling the object at the time crew
        crews.map((crew, i) => (
          <View key={i} style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text key={i} style={styles.getStartedText}>
              {crew.name} - {"   "} - {crew.pln} ---
            </Text>
            <Button title="Edit" onPress={() => handleEdit(crew)} />
            {/* calling the delete function and sending the crew as a parameter */}
            <Button title="X" onPress={() => handleDelete(crew)} />
          </View>
        ))
      }
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
      {Platform.OS === "ios" ? 
       <IOSPicker 
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={pname}
        onValueChange={(itemValue) => setPname(itemValue)}
      >
        {pnames.map((pname, i) => (
          <Picker.Item label={pname.name} value={pname} />
        ))}
      </IOSPicker >
      
:
     <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={pname}
        onValueChange={(itemValue) => setPname(itemValue)}
      >
        {pnames.map((pname, i) => (
          <Picker.Item label={pname.name} value={pname} />
        ))}
      </Picker>
}
      <Button title="Send" onPress={handleSend} />
      <Button
        color="green"
        title="Cancel"
        onPress={() => props.navigation.goBack()}
      ></Button>
    </ScrollView>
  );
};
CRUDCrew.navigationOptions = {
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
export default CRUDCrew;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: 'center',
    // justifyContent: "center",
  },
});
