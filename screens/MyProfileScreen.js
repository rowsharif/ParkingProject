//@refresh reset
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ShadowPropTypesIOS,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import UserProfile from "./UserProfile";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import CRUDHistory from "./CRUDHistory";
import CRUDServices from "./CRUDServices";
import CRUDMyProfile from "./CRUDMyProfile";
import CRUDPromotion from "./CRUDPromotion";
import CRUDCrew from "./CRUDCrew";
import CRUDEmployee from "./CRUDEmployee";
import CRUDNewsletter from "./CRUDNewsletter";
import EmployeeServices from "./EmployeeServices";
import CRUDParkings from "./CRUDParkings";
import CRUDParkingLots from "./CRUDParkingLots";
import CRUDNearestBuildings from "./CRUDNearestBuildings";
import CRUDMyPayments from "./CRUDMyPayments";
import CRUDPayments from "./CRUDPayments";
console.disableYellowBox = true;

////////stackNavigator is a transition between screens wherein each screen is placed ontop of the stack
///////////////Below, are different screens that are used within the screens folder. The initial screen is set as the userprofile screen. The userprofile screen then calls the other screens
////used within the initial screen using props. defaultNavigationOptions calls objects such as headerstyle, headerTintColor and headerTitleStyle that will reflect on the navigation
const StackNavigator = createStackNavigator(
  {
    UserProfile: {
      screen: UserProfile,
    },
    CRUDServices: {
      screen: CRUDServices,
    },
    UpdateUser: {
      screen: UpdateUser,
    },
    CRUDHistory: {
      screen: CRUDHistory,
    },
    CRUDMyPayments: {
      screen: CRUDMyPayments,
    },
    CRUDPayments: {
      screen: CRUDPayments,
    },
    CRUDParkings: {
      screen: CRUDParkings,
    },
    CRUDParkingLots: {
      screen: CRUDParkingLots,
    },
    CRUDNearestBuildings: {
      screen: CRUDNearestBuildings,
    },
    CRUDMyProfile: {
      screen: CRUDMyProfile,
    },
    CRUDPromotion: {
      screen: CRUDPromotion,
    },
    CRUDCrew: {
      screen: CRUDCrew,
    },
    CRUDEmployee: {
      screen: CRUDEmployee,
    },
    CRUDNewsletter: {
      screen: CRUDNewsletter,
    },
    EmployeeServices: {
      screen: EmployeeServices,
    },
  },
  {
    initialRouteName: "UserProfile",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#276b9c",
        height: 44,
      },

      // activeTintColor: "black",
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    },
    // tabBarOptions: {
    //   activeTintColor: "yellow",
    //   inactiveTintColor: "black",
    //   style: {
    //     backgroundColor: "#e6ffe6"
    //   }
    // }
  }
);

// createAppContainer is a function that is responsible to manage the app and link with the top level container components to take as a parameter (Maintabnavigation)
const AppContainer = createAppContainer(StackNavigator);

export default function MyProfileScreen() {
  return <AppContainer />;
  // return <CRUDNewsletter />
}

MyProfileScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#eee",
  },
});
