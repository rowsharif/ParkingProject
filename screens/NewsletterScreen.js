import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Image, Text, Modal, TextInput, Button, ImageBackground, SafeAreaView, FlatList } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import db from "../db.js";
import {
  FontAwesome 
} from "@expo/vector-icons";

export default function NewsletterScreen() {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newsletter, setNewsletter] = useState([]);
  const [news, setNews] = useState([]);


  useEffect(() => {
    // console.log("Newsletter123");
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

  const triggerModal = news => {
    setNews(news);
    setModalVisible(true);
    // console.log(modalVisible, news);
  };
   

  return (
    <View style={styles.container}>      
       <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
          
          <ScrollView style={{ flex:1, padding:"5%"}}>    
          <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          key={news.id}
          // onPress={()=>setModalVisible(false)}
        >
          <View style={{margin: "5%", backgroundColor: "#c7c7c7", height:"80%", borderRadius: 10, ...Platform.select({
                ios: {
                  marginTop:"15%"
                },
                android: {
                  marginTop:"15%"
                }
                })}}>

            <View style={{alignItems:"flex-end", margin:10}}>
              <FontAwesome  name="close" size={22} color="black" onPress={()=> setModalVisible(false)} />
            </View>
            <View style={{alignItems:"center", height:"100%", width:"100%"}}>
              <Image source={{uri: news.image}} resizeMode="contain" style={{width:"40%", height: "40%"}}/>
            <View style={{borderColor:"white", borderWidth:2, height:"55%", width:"90%", borderRadius:5}}>
              <Text style={{margin:"2%",textAlign:"center", fontWeight:"bold", fontSize:20}}>{news.header}</Text>
             <View style={{borderColor:"white", borderWidth:1, width:"100%"}}></View>
              <Text style={{margin:"2%", textAlign:"center"}}>{news.body}</Text>
            </View> 
            </View>
          </View>
        
        </Modal>        
          <View style={{height:"100%"}} >
            {newsletter.map( item => 
            <TouchableOpacity style={{backgroundColor:"#c7c7c7", height:150, borderRadius: 10, marginTop:"1%",
              ...Platform.select({
                ios: {
                  paddingTop:"2%",
                  padding:"3%"
                },
                android: {
                  paddingTop:"2%",
                  padding:"7%"

                }
                })}} 
                key={item.id}
                onPress={()=>triggerModal(item)}
                >

                  <Text style={{textAlign:"center", fontWeight:"bold",}}>{item.header}</Text>
                  <View style={{ height: "100%", flexDirection:"row", marginTop:5}}>
                  <Image source={{uri: item.image}} resizeMode="contain" style={{width:100, height: 100, marginTop:-10}}/>
                    
                    <Text style={{width:"67%", height: 100, marginLeft:8}}>{item.body}</Text>
                    
                  </View>
              </TouchableOpacity>
            )
              
            }            
            {/* <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)} style={{backgroundColor:"#c7c7c7", height:150, borderRadius: 10, marginTop:"1%",
                ...Platform.select({
                  ios: {
                    paddingTop:"2%",
                    padding:"3%"
                  },
                  android: {
                    paddingTop:"2%",
                    padding:"7%"

                  }
              })}} >
                <Text style={{textAlign:"center", fontWeight:"bold",}}>Header</Text>
                <View style={{ height: "100%", flexDirection:"row", marginTop:5}}>
                <Image source={require("../assets/images/green.png")} resizeMode="contain" style={{width:100, height: 100}}/>
                  
                  <Text style={{width:"67%", height: 100, marginLeft:8}}>ContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentContentContentContentContentContentContentContentContentContentContent</Text>
                  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)} style={{backgroundColor:"#c7c7c7", height:150, borderRadius: 10, marginTop:"1%",
                ...Platform.select({
                  ios: {
                    paddingTop:"2%",
                    padding:"3%"
                  },
                  android: {
                    paddingTop:"2%",
                    padding:"7%"

                  }
              })}} >
                <Text style={{textAlign:"center", fontWeight:"bold",}}>Header</Text>
                <View style={{ height: "100%", flexDirection:"row", marginTop:5}}>
                <Image source={require("../assets/images/green.png")} resizeMode="contain" style={{width:100, height: 100}}/>
                  
                  <Text style={{width:"67%", height: 100, marginLeft:8}}>ContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentContentContentContentContentContentContentContentContentContentContent</Text>
                  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)} style={{backgroundColor:"#c7c7c7", height:150, borderRadius: 10, marginTop:"1%",
                ...Platform.select({
                  ios: {
                    paddingTop:"2%",
                    padding:"3%"
                  },
                  android: {
                    paddingTop:"2%",
                    padding:"7%"

                  }
              })}} >
                <Text style={{textAlign:"center", fontWeight:"bold",}}>Header</Text>
                <View style={{ height: "100%", flexDirection:"row", marginTop:5}}>
                <Image source={require("../assets/images/green.png")} resizeMode="contain" style={{width:100, height: 100}}/>
                  
                  <Text style={{width:"67%", height: 100, marginLeft:8}}>ContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentConteContentContentContentContentContentContentContentContentContentContentContentContentContentContent</Text>
                  
                </View>
            </TouchableOpacity> */}
            
            
            

            <View style={{minHeight:100}}>

            </View>

            {/* <View style={{backgroundColor:"gray", width:"90%", height:"90%", margin:"5%", flexDirection:"row", minHeight: 150, justifyContent:"center", alignItems:"center", borderRadius:5}}>
                <View style={{backgroundColor:"red", width:"10%", height:"10%"}}>
                <Image source={require("../assets/images/green.png")} resizeMode="center" style={{width:20, height: 20}}/>
                </View>
                <View>
                  <Text>Content</Text>
                </View>  
            </View>                                               */}
          </View> 
            
            
          </ScrollView>
       </ImageBackground>      
    </View>
    
  );
}

NewsletterScreen.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex:2,
        flexDirection: "row"
      }}
    >    
      <Text
        style={{
          flex: 2,
          paddingTop: 10,
          fontSize: 18,
          fontWeight: "700",
          color: "white",
          textAlign: "left",
          paddingLeft: "3%"
        }}
      >
        Newsletter
      </Text>
      <View
        style={{
          flex: 1
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  newsletter: {          
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "gray",
    flexDirection: 'row'
  },
  nImage: {
    width: "20%",
    height: "20%"
  }  
  
});
