//@refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ShadowPropTypesIOS,Image } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";


const DeleteUser = (props) => {

    return (
        <View style={styles.container}>
            <Text>Good Job</Text>
            <Button  color="green" title="Back" onPress={() => props.navigation.goBack()} ><AntDesign name="back" size={30} color="black" /></Button>
            
        </View>
    );

};
DeleteUser.navigationOptions = {
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
  export default DeleteUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        alignItems: 'center',
        justifyContent: "center",
      
    },
}); 
