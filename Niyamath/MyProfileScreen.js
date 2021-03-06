//@refresh reset
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ShadowPropTypesIOS
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Feather
} from "@expo/vector-icons";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import UserProfile from "./UserProfile";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import CRUDServices from "./CRUDServices";
import CRUDParkings from "./CRUDParkings";
import CRUDParkingLots from "./CRUDParkingLots";
import CRUDNearestBuildings from "./CRUDNearestBuildings";

const StackNavigator = createStackNavigator(
  {
    UserProfile: {
      screen: UserProfile
    },
    CreateUser: {
      screen: CRUDServices
    },
    CRUDParkings: {
      screen: CRUDParkings
    },
     CRUDParkingLots: {
      screen: CRUDParkingLots
     },
     CRUDNearestBuildings:{
       screen:CRUDNearestBuildings
     },
     
    UpdateUser: {
      screen: UpdateUser
    },
    DeleteUser: {
      screen: DeleteUser
    }
  },
  {
    initialRouteName: "UserProfile",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#276b9c",
        height: 44
      },

      activeTintColor: "black",
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    },
    tabBarOptions: {
      activeTintColor: "yellow",
      inactiveTintColor: "black",
      style: {
        backgroundColor: "#e6ffe6"
      }
    }
  }
);

const AppContainer = createAppContainer(StackNavigator);

const MyProfileScreen = props => {
  return <AppContainer />;
};
export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#eee"
  }
});
