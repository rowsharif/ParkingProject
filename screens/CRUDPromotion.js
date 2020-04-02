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
  View
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
const handlePromotion = firebase.functions().httpsCallable("handlePromotion");

const CRUDPromotion = (props) => {
  const [promotions, setPromotion] = useState([]);
  const [code, setCode] = React.useState("");
  const [percent, setPercent] = React.useState("");
  const [enddate, setenddate] = React.useState();
  const [id, setId] = React.useState("");

  useEffect(() => {
    db.collection("Promotions").onSnapshot(querySnapshot => {
      const promotion = [];
      querySnapshot.forEach(doc => {
        promotion.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current promotion: ", promotion);
      setPromotion([...promotion]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handlePromotion({
        promotion: { id, percent, code },
        operation: "update"
      });
    } else {
      // call serverless function instead
      const response2 = await handlePromotion({
        promotion: { percent, code ,enddate},
        operation: "add"
      });
    }
    setPercent("");
    setCode("");
    setId("");
    setenddate("")
  };

  const handleEdit = promotion => {
    setPercent(promotion.percent);
    setCode(promotion.code);
    setId(promotion.id);
    setenddate(promotion.enddate);
  };
  const handleDelete = async promotion => {
    const response2 = await handlePromotion({
        promotion: promotion,
      operation: "delete"
    });
  };
  return (
    <View style={styles.container}>
     
        {promotions.map((promotion, i) => (
          <View style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {promotion.percent} - {promotion.code} 
            </Text>
            <Button title="Edit" onPress={() => handleEdit(promotion)} />
            <Button title="X" onPress={() => handleDelete(promotion)} />
          </View>
        ))}
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setPercent}
        placeholder="percent"
        value={percent}
      />
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setCode}
        placeholder="code"
        value={code}
      />
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button>

    </View>
  );
};
CRUDPromotion.navigationOptions = {
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
  export default CRUDPromotion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 
