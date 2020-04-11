//@refresh reset
import React, { useState, useEffect, useReducer } from "react";
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
} from "react-native";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
console.disableYellowBox = true;

const handleFAQ = firebase.functions().httpsCallable("handleFAQ");

const FAQ = (props) => {
  const [uid, setuid] = useState();

  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [id, setId] = React.useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState();

  const [user, setUser] = useState([]);

  useEffect(() => {
    console.log("uid", firebase.auth().currentUser.uid);
    setuid(firebase.auth().currentUser.uid);
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        const user = { id: doc.id, ...doc.data() };
        setUser(user);
        console.log("USERS", user);
      });
  }, []);

  useEffect(() => {
    db.collection("FAQs").onSnapshot((querySnapshot) => {
      const faqs = [];
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() });
      });

      console.log(" Current faqs: ", faqs);

      setFaqs([...faqs]);
    });
  }, []);

  const handleSend = async () => {
    if (id) {
      const response2 = await handleFAQ({
        faq: { id, question, answer },
        operation: "update",
      });
    } else {
      const response2 = await handleFAQ({
        faq: { question, answer },

        operation: "add",
      });
    }
    setQuestion("");
    setAnswer("");
    setId("");
    setModalVisible(false);
  };
  const handleEdit = (faq) => {
    setQuestion(faq.question);

    setAnswer(faq.answer);

    setId(faq.id);
  };

  const handleDelete = async (faq) => {
    const response2 = await handleFAQ({
      faq: faq,
      operation: "delete",
    });
    setModalVisible(false);
  };

  const handleEditModal = (faq) => {
    handleEdit(faq);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setQuestion("");
    setAnswer("");
    setId("");
    setCreate(true);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg11.jpeg")}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollView style={{ marginLeft: "5%", marginRight: "5%" }}>
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
            FAQ{" "}
          </Text>
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
                  <Text style={{ textAlign: "justify", fontWeight: "bold" }}>
                    Question:
                  </Text>
                </View>
                <TextInput
                  style={{
                    paddingLeft: 5,
                    margin: 5,
                    width: 300,
                    height: 50,
                    borderColor: "gray",
                    borderWidth: 1,
                    backgroundColor: "white",
                  }}
                  onChangeText={setQuestion}
                  placeholder="Question"
                  value={question}
                />
                {user && user.role && user.role == "manager" && (
                  <View>
                    <View style={{ alignItems: "flex-start", width: "80%" }}>
                      <Text
                        style={{ textAlign: "justify", fontWeight: "bold" }}
                      >
                        Answer:
                      </Text>
                    </View>
                    <TextInput
                      style={{
                        paddingLeft: 5,
                        margin: 5,
                        width: 300,
                        height: 100,
                        textAlign: "justify",
                        borderColor: "gray",
                        borderWidth: 1,
                        backgroundColor: "white",
                      }}
                      onChangeText={setAnswer}
                      placeholder="Answer"
                      value={answer}
                    />
                  </View>
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
                      onPress={() => handleDelete(setSelectedFAQ)}
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
          {faqs.map((faq, i) => (
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
              {(faq.answer ||
                (user &&
                  user.role &&
                  user.role == "manager" &&
                  !faq.answer)) && (
                <View
                  style={{
                    width:
                      user && user.role && user.role == "manager"
                        ? "80%"
                        : "100%",
                    paddingLeft: 10,
                    justifyContent: "center",
                    minHeight: 100,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }}>Question: </Text>
                    <Text
                      style={{
                        ...Platform.select({
                          ios: {
                            width: "71%",
                            fontWeight: "100",
                            paddingLeft: 5,
                            fontSize: 14,
                          },
                          android: {
                            width: "80%",
                            fontWeight: "100",
                            paddingLeft: 5,
                            fontSize: 14,
                          },
                        }),
                      }}
                    >
                      {faq.question}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }}>Answer: </Text>
                    <Text
                      style={{
                        ...Platform.select({
                          ios: {
                            width: "75%",
                            fontWeight: "200",
                            paddingLeft: 15,
                            fontSize: 14,
                          },
                          android: {
                            width: "80%",
                            fontWeight: "200",
                            paddingLeft: 15,
                            fontSize: 14,
                          },
                        }),
                      }}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              )}
              {user && user.role && user.role == "manager" && (
                <View style={{ width: "20%", height: 120 }}>
                  {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
                  <TouchableOpacity
                    onPress={() => handleEditModal(faq)}
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
                    <Text style={{ color: "white" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
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
            <Text style={{ color: "white" }}>Ask a Question</Text>
          </TouchableOpacity>
          {/* <Button
            title="Create New Newsletter"
            onPress={() => handleCreate()}
          ></Button> */}
          {/* <Button  title="Send" onPress={handleSend} />
        <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button> */}
        </View>
      </ImageBackground>
    </View>
  );
};

FAQ.navigationOptions = {
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
export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 300,
    height: 40,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    paddingLeft: 5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 10,
  },
  pickerItem: {
    color: "red",
  },
});
