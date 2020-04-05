//@refresh reset
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,Picker
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handleCrew = firebase.functions().httpsCallable("handleCrew");

const CRUDServices = (props) => {
  const [crews, setCrews] = useState([]);
  const[parking,setParking]=useState([]);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [fkp, setFkp] = useState();
const [pname,setPname]=useState()
const [pnames,setPnames]=useState([])
const [plname,setPlname]=useState([]);
  useEffect(() => {
    db.collection("ParkingLots")
      .get()
      .then(querySnapshot => {
        const ParkingLots = [];
        let allCrews = [];
        let allEmployees = [];
        querySnapshot.forEach(doc => {
          ParkingLots.push({ id: doc.id, ...doc.data() });
          db.collection("ParkingLots")
            .doc(doc.id)
            .collection("Crew")
            .onSnapshot(querySnapshot => {
              const ncrews = [];
              allCrews = allCrews.filter(p => p.fkp !== doc.id);
              querySnapshot.forEach(docP => {
                ncrews.push({ fkp: doc.id, id: docP.id, ...docP.data() });
              
              });
              allCrews = [...allCrews, ...ncrews];
              setCrews([...allCrews]);
              // console.log("Crews", allCrews);
              // console.log("Pnames",pnames.name)
              setPnames([...ParkingLots])

            });

        });
      });
  }, []);



  const handleSend = async () => {
    if (id) {
      const response2 = await handleCrew({
        crews: { id, name,fkp},
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handleCrew({
        crews: { name,fkp },
        operation: "add"
      });
    }
    setName("");
   
    setId("");
  };

  const handleEdit = crew => {
    setName(crew.name);
    setFkp(crew.fkp);

    setId(crew.id);
  };
  const handleDelete = async crew => {
    const response2 = await handleCrew({
        crew: crew,
      operation: "delete"
    });
  };
  return (
    <ScrollView style={styles.container}>
        {crews.map((crew, i) => (
          <View key={i}style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text key={i} style={styles.getStartedText}>
              {crew.name} - {"   "} - {crew.fkp} ---
            </Text>
            <Button title="Edit" onPress={() => handleEdit(crew)} />
            <Button title="X" onPress={() => handleDelete(crew)} />
          </View>
        ))}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />
      <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={pname}
          onValueChange={itemValue => setPname(itemValue)}
        >
          {pnames.map((pname, i) => (
            <Picker.Item label={pname.name} value={pname} />
          ))}
        </Picker>
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button>

    </ScrollView>
  );
};
CRUDServices.navigationOptions = {
    headerTitle: (
      <View
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        <Text
          style={{
            flex: 1,
            paddingTop: 10,
            fontSize: 18,
            fontWeight: "700",
            color: "white",
            textAlign: "center"
          }}
        >
          MyProfile
        </Text>
        <View
          style={{
            flex: 2
          }}
        ></View>
  
        <View style={{ alignSelf: "center", flex: 2 }}>
          <Image
            resizeMode="cover"
            style={{
              width: 120,
              height: 50,
              resizeMode: "contain"
            }}
            source={require("../assets/images/logo.png")}
          />
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#276b9c",
      height: 44
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  export default CRUDServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        // alignItems: 'center',
        // justifyContent: "center",
      
    },
}); 
