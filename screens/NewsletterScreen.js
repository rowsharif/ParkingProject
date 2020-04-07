//@refresh reset
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Image, Text, Modal, TextInput, Button, ImageBackground, SafeAreaView, FlatList, ScrollView, TouchableOpacity } from "react-native";
import db from "../db.js";
import {
  FontAwesome 
} from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';


export default function NewsletterScreen() {
  // Hooks: Hooks only work with functions, and do not work with classes. 

  // useState: 
  //  Using this hook, it allows to have state variables.
  //  As shown below, state variables are declared using useState. Inside the [] brackets, the first part is the variable name,
  //  and the second part after the comma is the name used to call to update the value of the variable, an example of this can be found in the useEffect below on Line 39.
  //  The initial state of the variable value will be set to a value such as true, false, a number, or an array etcetera and that will be used inside the brackets of useState (value).
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newsletter, setNewsletter] = useState([]);
  const [news, setNews] = useState([]);

  // UseEffect:
  //   Using this component react will know that it needs to do things after rendering such as calling functions
  //   after update, or fetch data. Thus, it allows to use the state variables when used it inside a component.
  //   useEffect will render after every change in useState by default, which is an update. However, when include 
  //   [] brackets, it is going to render the once. And if you had a variable inside bracket, for example [news],
  //   useEffect will render everytime the useState variable 'news' is updated.
  useEffect(() => {
    db.collection("newsletter").onSnapshot( querySnapshot => {
      const news = [];
      querySnapshot.forEach(doc => {
        news.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setNewsletter([...news]);
    }
    )
  }, []);

  const triggerModal = news => {
    setNews(news);
    setModalVisible(true);
  };
   

  return (
    <View style={styles.container}>      
        {/* 
          ImageBackground is an react-native component, which allows to set an image as the background image of the screen.
          the link or the path to image will be specified to the "source" in order to locate the image. The style of the image, width and height is 
          set to 100%.
        */}
       <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
          {/* 
            This react-native component which tranforms the screen to a scrollable screen. By default, ScrollView will
            allow scrolling vertically in a cloumn, whereas if you pass in the prop horizontal="true", the screen will
            be horizontally scrollable, where the ScrollView's childs are arranged horziontally in a row.
          */}
          <ScrollView style={{ flex:1, padding:"5%"}}> 

          {/* 
            This react-native component allows you to show content above an existing screen easily. 
            The props in this component are:
              - animationType, which coltrols how the modal animates. By default it is set to false, and props include "slide", "fade".
              - transparent, this prop decides if the modal should render and fill the entire view or over a transparent background. When set to true, it will render above a transparent background.
              - visible, prop controls whether the modal is visible or not. In this example, it is set to the state variable modalVisible, which is either true or false.
           */}
          <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}          
          key={news.id}
          onRequestClose={() => {
            setModalVisible(false);
          }}
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
                {/* 
                  This react-native component enables to display images from the local storage or the internet. 
                  The path to the image is set to source, in order to locate the image. resizeMode prop receives either "cover", "contain", "stretch", "repeat"
                  , and "center" in order to resize the image when the frame does not match the image dimensions.
                  Other props include style, which determines the the height, and width etc.
                */}
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
            {newsletter.map( (item, index) =>
            
            //  The animation component allows the any component to animate in a specific way. The animation prop takes in the name of the predefined animations
            //  where there a wide variety of animations. The interationCount prop, defines how many times the animation should happen when rendered, which takes a number 
            //  as a value or "infinite", where the animation would not stop. 
            //  In this case, animation will be set to slideInLeft for the first item, and second rendered item will have the slideInRight animation, and the third will be slidInLeft. And so on and on.
            //  And the animation will only happen one time, since the iterationCount is set to 1 in this case.
            //  Since, it is looping through the array, the component is going to have duplicate key, therefore the key is set to the ID.
            <Animatable.View animation={index%2===0?"slideInLeft":"slideInRight"} iterationCount={1} style={{ textAlign: 'center' }} key={item.id}>
              {/* 
                This react-native component is similar to of a button, but much more customizable. This responds properly to clicks or touch events,
                and display feedback. The onPress prop wait for a touch event in order to render what is specified inside the brackets.
              */}
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
              </Animatable.View>
            )              
            }     

            <View style={{minHeight:100}}>

            </View>
          </View>             
            
          </ScrollView>
       </ImageBackground>      
    </View>
    
  );
}

//  These navigation options allows you to define what to show on the navigation bar at the top
//  headerTitle displays the content at the top
//  headerStyle determines the style for the bar
//  headerTintColor determines the color of the icon on header
//  headerTitleColor determines the color of the title
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
