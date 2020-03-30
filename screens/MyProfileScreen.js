//@refresh reset
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ShadowPropTypesIOS } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import UserProfile from './UserProfile';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import DeleteUser from './DeleteUser';

const StackNavigator = createStackNavigator({
  UserProfile: {
      screen: UserProfile
    },
    CreateUser: {
      screen: CreateUser
    },
    UpdateUser: {
      screen: UpdateUser
    },
    DeleteUser: {
      screen: DeleteUser
    },
  
  },
   {
    initialRouteName: 'UserProfile',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#276b9c",
        height: 44
      },
   
      activeTintColor: "black",
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      
    },
    tabBarOptions: {
      activeTintColor: "yellow",
       inactiveTintColor: "black",
       style: {
         backgroundColor: "#e6ffe6",
         
     }}
   
  })
  
  const AppContainer = createAppContainer(StackNavigator);

const MyProfileScreen = (props) => {

    return (<AppContainer />);

  // return (
  //   <View  style={styles.container}>      
  //      <ImageBackground source={require("../assets/images/bg11.jpeg")} style={{ width: "100%", height: "100%"}}>  
  //   {/* <ScrollView style={styles.container} keyboardShouldPersistTaps="always"> */}
  //     <TextInput
  //       style={{
  //         height: 40,
  //         borderColor: "gray",
  //         borderWidth: 1,
  //         fontSize: 24
  //       }}
  //       onChangeText={setDisplayName}
  //       placeholder="Display Name"
  //       value={displayName}
  //     />
  //     {photoURL !== "" && (
  //       <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
  //     )}
  //     <Button title="Pick Image" onPress={handlePickImage} />
  //     <Button title="Save" onPress={handleSave} />
  //   {/* </ScrollView> */}
  //   </ImageBackground>      
  //   </View>
  // );
}

MyProfileScreen.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 2,
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
        MyProfile
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
 export default MyProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: "#eee"
    },
}); 
