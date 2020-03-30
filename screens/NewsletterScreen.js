import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, ImageBackground, SafeAreaView, FlatList } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

export default function NewsletterScreen() {
  const [data, setData] = useState([
    {id:1, name:"Mohammed"},
    {id:2, name: "Ali"},
    {id:3, name:"Mona"},
    {id:1, name:"Mohammed"},
    {id:2, name: "Ali"},
    {id:3, name:"Mona"},
]);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>      
       <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
          
          <ScrollView style={{ flex:1, padding:"5%"}}>            
          <View style={{height:"100%"}} >            
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
