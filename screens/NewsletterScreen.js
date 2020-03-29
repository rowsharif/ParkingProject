import React from "react";
import { StyleSheet, View, Image, Text, TextInput, Button, ImageBackground } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { ScrollView } from "react-native-gesture-handler";

export default function NewsletterScreen() {
  return (
    <View style={styles.container}>      
       <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>   
          <ScrollView>
            
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
          textAlign: "center"
        }}
      >
        Newsletter
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  
});
