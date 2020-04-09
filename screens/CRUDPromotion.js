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
  View,
  DatePickerIOS
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import DatePicker from 'react-native-datepicker'

import * as Animatable from 'react-native-animatable';

const handlePromotion = firebase.functions().httpsCallable("handlePromotion");

  const CRUDPromotion = (props) => {
  const [promotions, setPromotion] = useState([]);
  const [code, setCode] = React.useState("");
  const [percent, setPercent] = React.useState("");
  const [id, setId] = React.useState("");
  const [endDateTime, setendDateTime] = React.useState("");
    const [startdate,setStartDate]=useState("");
const [startingdate,setStartingdate]=useState("");



  useEffect(() => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var dateTime = date+' ';
    setStartDate(dateTime)

    var today1 = new Date();
    var date1 = today1.getFullYear()+'-'+(today1.getMonth()+1)+'-'+(today1.getDate()+1)+ "   ";
    var time1 = today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
    var dateTime1 = date1+' '+time1;
    setStartingdate(dateTime1)


    db.collection("Promotions").onSnapshot(querySnapshot => {
      const promotion = [];
      querySnapshot.forEach(doc => {
        promotion.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current promotion: ", promotion);
      setPromotion([...promotion]);
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", promotion.endDateTime)

    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handlePromotion({
        promotion: { id, percent, code,
         endDateTime:firebase.firestore.Timestamp.fromDate(new Date(endDateTime) )   },
        operation: "update"
      });
      console.log(".........",endDateTime)

    } else {
      // call serverless function instead
      const response2 = await handlePromotion({
        promotion: { percent, code ,endDateTime:firebase.firestore.Timestamp.fromDate(new Date(endDateTime) ) },

        operation: "add"
      });
      console.log(".........",endDateTime)

    }
    setPercent("");
    setCode("");
    setId("");
    
    setendDateTime("")

  };

  const handleEdit = promotion => {
    setPercent(promotion.percent);
    setCode(promotion.code);
    setId(promotion.id);
    setendDateTime(promotion.endDateTime);
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
          <View key={i} style={{ paddingTop: 50, flexDirection: "row" }}>
            <Text style={styles.getStartedText}>
              {promotion.percent} - {promotion.code} - endDateTime {promotion.endDateTime && new Date(promotion.endDateTime.toDate().getMonth())}
              {/* -{promotion.endDateTime && new Date().getUTCMonth(promotion.endDateTime)}-{promotion.endDateTime && new Date().getUTCFullYear(promotion.endDateTime)}  */}
              
            </Text>

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



<Text>Start Date of promotion: {startdate}</Text>
      


{Platform.OS === 'ios'?

<DatePickerIOS
         style={{width: 200}}
         date={endDateTime}
         mode="date"
         placeholder={endDateTime}
         format="YYYY-MM-DD"
         minDate={startingdate}
         maxDate="2022-06-01"
         confirmBtnText="Confirm"
         cancelBtnText="Cancel"
         customStyles={{
           dateIcon: {
             position: 'absolute',
             left: 0,
             top: 4,
             marginLeft: 0
           }, 
           dateInput: {
             marginLeft: 36
           }
           // ... You can check the source to find the other keys.
         }}
         onDateChange={(date)=>setendDateTime(date)}
         />
:
<DatePicker
        style={{width: 350}}
        date={endDateTime}
        mode="date"
        placeholder={endDateTime}
        format="YYYY-MM-DD"
        minDate={startingdate}
        maxDate="2022-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date)=>setendDateTime(date)}
      />
  }

{/* 
       <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setendDateTime}
        placeholder="endDateTime"
        value={endDateTime}
      /> */}
      <Animatable.View animation="bounceIn" iterationCount={3} direction="alternate" style={{ width: "100%" }}>
      <Button title="Send" onPress={handleSend} />
      <Button  color="green" title="Cancel" onPress={() => props.navigation.goBack()} ></Button>
      </Animatable.View>
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
