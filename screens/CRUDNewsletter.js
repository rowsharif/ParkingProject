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
  ImageBackground,
  KeyboardAvoidingView,
  Modal
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as Animatable from 'react-native-animatable';
import {
  FontAwesome 
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
console.disableYellowBox = true;

const handleNewsletter = firebase.functions().httpsCallable("handleNewsletter");

const CRUDNewsletter = (props) => {
  const [newsletter, setNewsletter] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState([]);
  const [id, setId] = useState("");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [create, setCreate] = useState(false);
  
  const [upload, setUpload] = useState(false);
  const [uri, setUri] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [time, setTime] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showProgress, setshowProgress] = useState(false);

  useEffect(() => {
    db.collection("newsletter").onSnapshot( querySnapshot => {
      const news = [];
      querySnapshot.forEach(doc => {
        news.push({
          id: doc.id,
          ...doc.data()
        })
        // console.log("News:---: ", news);
      })
      setNewsletter([...news]);
      // console.log("-------------------",newsletter);
    }
    )
  }, []);

  const handleUpload = async (u) => {
    // if (uri !== image) {
      const response = await fetch(u);
      const blob = await response.blob();
      // const date = new Date;
      const dateTime = new Date().getTime();
      // console.log("ddddddddddddddddddddddddd",dateTime);
      const putResult = await firebase
        .storage()
        .ref()
        .child("News- "+dateTime)
        .put(blob);
      const url = await firebase
        .storage()
        .ref()
        .child("News- "+dateTime)
        .getDownloadURL();

      setUri(url);
      setImage(url);
      // console.log("----------------------",url)
      // setPhotoURL(url);
    // }
  };

  const handlePickImage = async () => { 
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
      setImage(result.uri);
      // handleUpload(uri);
    }
    setProgress(0);
    setTime(5);
  };

  const timer = async () => {
    setshowProgress(true);
    setTime(time - 1);
    setProgress(progress + 0.3);
    if (time - 1 <= 0) {
      await handleUpload(uri);
      setshowProgress(false);
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    time > 0 && setTimeoutId(setTimeout(() => timer(), 1000));
  }, [time]);

  const handleSend = async () => {
    console.log("idddddddddddddd", id)
    if (id) {
      console.log("updateeeeeeee");
      const response2 = await handleNewsletter({
        newsletter: { id, header, body, image },
        operation: "update"
      });
    } else {
      // call serverless function instead
      console.log("add");
      const response2 = await handleNewsletter({
        newsletter: { header, body, image },
        operation: "add"
      });
      // console.log("resssssssssssssssssssssssssss",image);
    }
    
    setId(null);
    setHeader("");
    setBody("");
    setImage(null);
    setModalVisible(false);
  };

  const handleEdit = newsletter => {
    setId(newsletter.id);
    setHeader(newsletter.header);
    setBody(newsletter.body);
    setImage(newsletter.image);
    setSelectedNewsletter(newsletter);
  };

  const handleDelete = async newsletter => {
    const response2 = await handleNewsletter({
      newsletter: newsletter,
      operation: "delete"
    });
    setModalVisible(false);

  };

  const handleEditModal = newsletter => {
    handleEdit(newsletter);
    setCreate(false);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setId(null);
    setHeader("");
    setBody("");
    setImage(null);
    setCreate(true);
    setModalVisible(true);

  };

  return (
    // <KeyboardAvoidingView style={styles.container} behavior={Platform.Os == "ios" ? "padding" : "height"}>

    <View style={styles.container}>      
       <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
        <ScrollView style={{ marginLeft: "5%", marginRight:"5%"}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}          
          // key={news.id}
        >
          <View style={{margin: "5%", backgroundColor: "#c7c7c7", height:"80%", borderRadius: 10, ...Platform.select({
                ios: {
                  marginTop:"15%"
                },
                android: {
                  marginTop:"15%"
                }
          })}}>
            <Animatable.View animation="pulse" iterationCount="infinite" style={{ textAlign: 'center' }}>
              <View style={{alignItems:"flex-end", margin:10}}>
                <FontAwesome  name="close" size={22} color="black" onPress={()=> setModalVisible(false)} />
              </View>
            </Animatable.View>

            <View style={{alignItems:"center", height:"100%", width:"100%"}}>
              <View style={{alignItems:"flex-start", width:"80%"}}>
                <Text style={{textAlign:"left", fontWeight:"bold"}}>Header:</Text>
              </View>
              <TextInput
                style={{paddingLeft:5, margin:5, width:300, height: 40, borderColor: "gray", borderWidth: 1, backgroundColor:"white"  }}
                onChangeText={setHeader}
                placeholder="Header"
                value={header}
              />
              <View style={{alignItems:"flex-start", width:"80%"}}>
                <Text style={{textAlign:"left", fontWeight:"bold"}}>Body:</Text>
              </View>
              <TextInput
                style={{ paddingLeft:5, margin:5,width:300,height: 100, borderColor: "gray", borderWidth: 1, backgroundColor:"white"  }}
                onChangeText={setBody}
                placeholder="Body"
                value={body}
              />
              <View style={{alignItems:"flex-start", width:"80%"}}>
                <Text style={{textAlign:"left", fontWeight:"bold"}}>Image:</Text>
              </View>
              <View style={{width:"80%", flexDirection:"row", borderWidth:1, borderColor:"gray"}}>
                <TouchableOpacity onPress={() => setUpload(false)} style={{width:"50%", backgroundColor:upload?'lightgray':'#e6e6e6', padding:2, justifyContent:"center", alignItems:'center'}}>
                  <Text>Gallery</Text>
                </TouchableOpacity>
                {/* <Text>|</Text> */}
                <TouchableOpacity  onPress={()=>setUpload(true)} style={{width:"50%",backgroundColor:upload?'#e6e6e6':'lightgray', padding:2, justifyContent:"center", alignItems:'center'}} >
                  <Text>URL</Text>
                </TouchableOpacity>
              </View>
              {
                upload ? 
                  <TextInput
                  style={{ paddingLeft:5, margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1, backgroundColor:"white" }}
                  onChangeText={setImage}
                  placeholder="Image URL"
                  value={image}
                  />
                :
                  <View style={{  margin:5,width:300,height: 60, borderColor: "gray", borderWidth: 1, justifyContent:"center", alignItems:'center', flexDirection: "row" }}>
                    {image && <Image source={{uri: image}} resizeMode="contain" style={{width:50, height: 50}}/>}
                    <TouchableOpacity  onPress={()=>handlePickImage()} style={{width:"50%",backgroundColor:"#e6e6e6", padding:2, justifyContent:"center", alignItems:'center', borderRadius:5}} >
                      <Text>Choose Image</Text>
                    </TouchableOpacity>
                  </View>
              }
              
              
                {create ? 
                <View style={{width:"100%", height:"10%", flexDirection:"row", marginTop:"10%", justifyContent:"center"}}>
                  <TouchableOpacity  onPress={()=>handleSend()} style={{width:"30%", backgroundColor:"#5dba68", padding:2, justifyContent:"center", alignItems:'center', borderRadius:5, margin:5}} >
                    <Text>Create</Text>
                  </TouchableOpacity> 
                </View>
                : 
                <View style={{width:"100%", height:"10%", flexDirection:"row", marginTop:"10%", justifyContent:"center"}}>
                <TouchableOpacity onPress={() => handleDelete(selectedNewsletter)} style={{width:"30%", backgroundColor:"#eb5a50", padding:2, justifyContent:"center", alignItems:'center', borderRadius:5, margin:5}}>
                  <Text>Delete</Text>
                </TouchableOpacity>
                
                <TouchableOpacity  onPress={()=>handleSend()} style={{width:"30%", backgroundColor:"#5dba68", padding:2, justifyContent:"center", alignItems:'center', borderRadius:5, margin:5}} >
                  <Text>Save</Text>
                </TouchableOpacity>
                </View>
              }
              
              </View>
            </View>
            
          
        
        </Modal>  
        {newsletter.map((newsletter, i) => (
          <View key={newsletter.id} style={{backgroundColor:"#c7c7c7", borderRadius: 5, justifyContent:"center", margin:10, flexDirection: "row"}}>
            <View style={{width:"80%",paddingTop:5}}>
            <View style={{flexDirection: "row", alignItems:"center", paddingLeft:20}}>
            <Image source={{uri: newsletter.image}} resizeMode="contain" style={{width:50, height: 50}}/>
            <Text style={{fontWeight:"bold", marginLeft:10}}>
              {newsletter.header}
            </Text>
            </View>
            
            <View style={{ paddingTop: 10, flexDirection: "row" }}>
              <View style={{width:"80%", paddingLeft:20}}>
              <Text >
                {newsletter.body}
              </Text>
              </View>
              
              {/* <Button title="X" onPress={() => handleDelete(newsletter)} /> */}
            </View>
            </View>
            <View style={{width:"20%", height:150}}>
              {/* <Button title="Edit" onPress={() => handleEditModal(newsletter)} /> */}
              <TouchableOpacity  onPress={() => handleEditModal(newsletter)} style={{backgroundColor:"#276b9c", width:"100%", height:"100%", justifyContent:"center", alignItems:"center", borderTopRightRadius:5, borderBottomRightRadius:5}} >
                  <Text>Edit</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        ))}
        {/* <View style={{justifyContent:"center", alignItems:"center"}}>
        <TextInput
        style={{margin:5, width:300, height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setHeader}
        placeholder="Header"
        value={header}
      />
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setBody}
        placeholder="Body"
        value={body}
      />
      <TextInput
        style={{ margin:5,width:300,height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setImage}
        placeholder="Image URL"
        value={image}
      />
        </View> */}

      
      <View style={{height:100}}>
        {/* Empty to View to fix scrolling height issue */}
      </View>

      </ScrollView>
      <View>
        <Button  title="Create New Newsletter" onPress={() => handleCreate()} ></Button>
        {/* <Button  title="Send" onPress={handleSend} />
        <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ></Button> */}
      </View>
      
      </ImageBackground>      
     </View>
    // </KeyboardAvoidingView>
  );
};
CRUDNewsletter.navigationOptions = {
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
          CRUDNewsletter
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
  export default CRUDNewsletter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 