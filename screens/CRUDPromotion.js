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
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Picker,
  DatePickerIOS,
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import DatePicker from "react-native-datepicker";

import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
console.disableYellowBox = true;

const handlePromotion = firebase.functions().httpsCallable("handlePromotion");

const CRUDPromotion = (props) => {
  const [promotions, setPromotions] = useState([]);

  const [code, setCode] = React.useState("");

  const [percent, setPercent] = React.useState("");

  const [id, setId] = React.useState("");

  const [endDateTime, setendDateTime] = React.useState(new Date());

  const [startdate, setStartDate] = useState("");

  const [startingdate, setStartingdate] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState();

  useEffect(() => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var dateTime = date + " ";
    setStartDate(dateTime);

    var today1 = new Date();
    var date1 =
      today1.getFullYear() +
      "-" +
      (today1.getMonth() + 1) +
      "-" +
      (today1.getDate() + 1) +
      "   ";
    var time1 =
      today1.getHours() + ":" + today1.getMinutes() + ":" + today1.getSeconds();
    var dateTime1 = date1 + " " + time1;
    setStartingdate(dateTime1);

    db.collection("Promotions").onSnapshot((querySnapshot) => {
      const promotions = [];
      querySnapshot.forEach((doc) => {
        promotions.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current promotion: ", promotions);
      setPromotions([...promotions]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handlePromotion({
        promotion: {
          id,
          percent,
          code,
          endDateTime,
        },
        operation: "update",
      });
    } else {
      // call serverless function instead
      const response2 = await handlePromotion({
        promotion: {
          percent,
          code,
          endDateTime,
        },

        operation: "add",
      });
    }

    setPercent("");
    setCode("");
    setId("");
    setModalVisible(false);
    setendDateTime(new Date());
  };

  const handleEdit = (promotion) => {
    setPercent(promotion.percent);
    setCode(promotion.code);
    setId(promotion.id);
    setendDateTime(promotion.endDateTime);
    setSelectedPromotion(promotion);
  };

  const handleDelete = async (promotion) => {
    const response2 = await handlePromotion({
      promotion: promotion,
      operation: "delete",
    });
    setModalVisible(false);
  };
  const handleEditModal = (promotion) => {
    handleEdit(promotion);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setPercent("");
    setCode("");
    setId("");
    setendDateTime(new Date());
    setCreate(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
            paddingTop: 10,
            paddingLeft: 10,
          }}
        >
          {" "}
          Promotion{" "}
        </Text>
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
            // key={news.id}
          >
            <View
              style={{
                margin: "5%",
                backgroundColor: "#c7c7c7",
                height: "80%",
                borderRadius: 10,
                ...Platform.select({
                  ios: {
                    marginTop: "15%",
                  },
                  android: {
                    marginTop: "15%",
                  },
                }),
              }}
            >
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                style={{ textAlign: "center" }}
              >
                <View style={{ alignItems: "flex-end", margin: 10 }}>
                  <FontAwesome
                    name="close"
                    size={22}
                    color="black"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </Animatable.View>

              <View
                style={{ alignItems: "center", height: "100%", width: "100%" }}
              >
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Code:
                  </Text>
                </View>
                <TextInput
                  style={{
                    paddingLeft: 5,
                    margin: 5,
                    width: 300,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    backgroundColor: "white",
                  }}
                  onChangeText={setCode}
                  placeholder="Code"
                  value={code + ""}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Percentage:
                  </Text>
                </View>
                <TextInput
                  style={{
                    paddingLeft: 5,
                    margin: 5,
                    width: 300,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    backgroundColor: "white",
                  }}
                  onChangeText={setPercent}
                  placeholder="Percent"
                  value={percent + ""}
                />
                <View style={{ alignItems: "flex-start", width: "80%" }}>
                  <Text style={{ textAlign: "left", fontWeight: "bold" }}>
                    Promotion End Date:
                  </Text>
                </View>

                {Platform.OS === "ios" ? (
                  <DatePickerIOS
                    style={{ width: 300 }}
                    date={endDateTime}
                    mode="date"
                    placeholder={endDateTime}
                    format="YYYY-MM-DD"
                    minDate="2020-01-01"
                    maxDate="2022-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => setendDateTime(date)}
                  />
                ) : (
                  <DatePicker
                    style={{ width: 300 }}
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
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => setendDateTime(date)}
                  />
                )}

                {create ? (
                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                      flexDirection: "row",
                      marginTop: "10%",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleSend()}
                      style={{
                        width: "30%",
                        backgroundColor: "#5dba68",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Create</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                      flexDirection: "row",
                      marginTop: "10%",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDelete(promotion)}
                      style={{
                        width: "30%",
                        backgroundColor: "#eb5a50",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleSend()}
                      style={{
                        width: "30%",
                        backgroundColor: "#5dba68",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
          {promotions.map((promotion, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#c7c7c7",
                borderRadius: 5,
                justifyContent: "center",
                margin: 10,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "80%",
                  paddingLeft: 10,
                  justifyContent: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Promotion Code:</Text>
                  <Text> {promotion.code}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>Discount:</Text>
                  <Text style={{ width: "85%" }}> {promotion.percent}%</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>End Date:</Text>
                  <Text>
                    {" "}
                    {promotion.endDateTime.toDate().getDate()}-
                    {promotion.endDateTime.toDate().getMonth() + 1}-
                    {promotion.endDateTime.toDate().getFullYear()}
                  </Text>
                </View>
              </View>
              <View style={{ width: "20%", height: 120 }}>
                {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                <TouchableOpacity
                  // onPress={() => handleEditModal(promotion)}
                  onPress={() => handleDelete(promotion)}
                  style={{
                    backgroundColor: "#276b9c",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{ height: 100 }}>
            {/* Empty to View to fix scrolling height issue */}
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            onPress={() => handleCreate()}
            style={{
              backgroundColor: "#75213d",
              width: "100%",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              // borderTopRightRadius: 5,
              // borderBottomRightRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Create New Promotion</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
CRUDPromotion.navigationOptions = {
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
export default CRUDPromotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
