//@refresh reset
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ShadowPropTypesIOS,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome5Brands,
} from "@expo/vector-icons";

import firebase from "firebase/app";
import "firebase/auth";

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
import FAQ from "./FAQ";
console.disableYellowBox = true;

import CRUDUserRole from "./CRUDUserRole";
//import CRUDMyPayments from "./CRUDMyPayments"
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
    CRUDParkings: {
      screen: CRUDParkings,
    },
    FAQ: {
      screen: FAQ,
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
    CRUDUserRole: {
      screen: CRUDUserRole,
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

const MyDrawerNavigator = createDrawerNavigator(
  {
    MyProfile: {
      screen: UserProfile,
    },
    Services: {
      screen: CRUDServices,
    },
    // UpdateUser: {
    //   screen: UpdateUser,
    // },
    History: {
      screen: CRUDHistory,
    },
    MyPayments: {
      screen: CRUDMyPayments,
    },
    Payments: {
      screen: CRUDPayments,
    },
    Parkings: {
      screen: CRUDParkings,
    },
    ParkingLots: {
      screen: CRUDParkingLots,
    },
    NearestBuildings: {
      screen: CRUDNearestBuildings,
    },
    MyHistory: {
      screen: CRUDMyProfile,
    },
    Promotion: {
      screen: CRUDPromotion,
    },
    Crew: {
      screen: CRUDCrew,
    },
    Employee: {
      screen: CRUDEmployee,
    },
    Newsletter: {
      screen: CRUDNewsletter,
    },
    EmployeeServices: {
      screen: EmployeeServices,
    },
    FAQ: {
      screen: FAQ,
    },
  },
  {
    contentComponent: (props) => (
      <ScrollView style={{}}>
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <DrawerItems {...props} />
          <TouchableOpacity
            style={{
              backgroundColor: "lightgray",
              alignItems: "center",
              justifyContent: "flex-end",
              // marginTop: 350,
            }}
            onPress={() =>
              Alert.alert(
                "Log out",
                "Do you want to logout?",
                [
                  {
                    text: "Cancel",
                    onPress: () => {
                      return null;
                    },
                  },
                  {
                    text: "Confirm",
                    onPress: () => {
                      // props.navigation.navigate("Home");
                      firebase.auth().signOut();
                    },
                  },
                ],
                { cancelable: false }
              )
            }
          >
            <Text
              style={{
                margin: 16,
                color: "#276b9c",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    ),
  }
);
// createAppContainer is a function that is responsible to manage the app and link with the top level container components to take as a parameter (Maintabnavigation)
const AppContainer = createAppContainer(StackNavigator);

const AppContainer2 = createAppContainer(MyDrawerNavigator);

export default function MyProfileScreen() {
  return <AppContainer2 />;
  // return <CRUDNewsletter />
}

MyProfileScreen.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 2,
        flexDirection: "row",
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
          paddingLeft: "3%",
        }}
      >
        {" "}
        <AntDesign name="menu-fold" size={24} color="white" /> Settings
      </Text>
      <View
        style={{
          flex: 1,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#eee",
  },
});
