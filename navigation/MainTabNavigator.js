import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Feather
} from "@expo/vector-icons";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import NewsletterScreen from "../screens/NewsletterScreen";
import CampusMap from "../screens/CampusMap";
import MyProfileScreen from "../screens/MyProfileScreen";

////Below selects the platform to run the app
///if the platform is web, the headermode is set to screen
///default returns the most fitting platform that the user is running the app 
const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});


//// Below creates a stack navigator;homestack of the home screen
//////this creates a screen in the navbar by calling the screen file 
//////HomeScreen is loaded to the stackNavigator and a 'navigation' prop will be given
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
    
  },
  config
);
 /////below is a text label that will be displayed in the navigationbar of the homescreen
////below is an icon that will be displayed along with the label text of the screen in the navbar
/////path is a maping that is set in the route configs. The action is taken from the path
HomeStack.navigationOptions = {
 
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <MaterialCommunityIcons
      focused={focused}
      name="home-outline"
      size={25}
      color="white"
    />
  )
};

HomeStack.path = "";

const AboutStack = createStackNavigator(
  {
    About: AboutScreen
  },
  config
);

AboutStack.navigationOptions = {
  tabBarLabel: "About",
  tabBarIcon: ({ focused }) => (
    <Feather focused={focused} name="info" size={25} color="white" />
  )
};

AboutStack.path = "";

const NewsletterStack = createStackNavigator(
  {
    Newsletter: NewsletterScreen
  },
  config
);

NewsletterStack.navigationOptions = {
  tabBarLabel: "Newsletter",
  tabBarIcon: ({ focused }) => (
    <FontAwesome focused={focused} name="newspaper-o" size={22} color="white" />
  )
};

NewsletterStack.path = "";

const CampusMapStack = createStackNavigator(
  {
    CampusMap: CampusMap
  },
  config
);

CampusMapStack.navigationOptions = {
  tabBarLabel: "CampusMap",
  tabBarIcon: ({ focused }) => (
    <FontAwesome focused={focused} name="map-o" size={20} color="white" />
  )
};

CampusMapStack.path = "";

const MyProfileStack = createStackNavigator(
  {
    MyProfile: MyProfileScreen
  },
  config
);

MyProfileStack.navigationOptions = {
  tabBarLabel: "User Profile",
  tabBarIcon: ({ focused }) => (
    <AntDesign focused={focused} name="profile" size={25} color="white" />
  )
};

MyProfileStack.path = "";




//////createMaterialBottomTabNavigator creates a navigation at the bottom of the app and calls all the stacks that were created above to display in the navigation bar.
    ////swipeEnabled allows swiping between tabs
////animationEnabled allows to animate while moving between tabs
///activeColor color of the active tab
///inactiveColor color of the inactive tabs
///indicatorStyle style object for the tab indicator (line at the bottom of the tab).
const tabNavigator = createMaterialBottomTabNavigator(
  {
    HomeStack,
    CampusMapStack,
    MyProfileStack,
    AboutStack,
    NewsletterStack
  },
  {
    //tabBarPosition: "top",
    swipeEnabled: true,
    animationEnabled: true,
    activeColor: "white",
    inactiveColor: "gray",
    barStyle: { backgroundColor: "#276b9c" },
    tabBarOptions: {
      activeTintColor: "white",
      inactiveTintColor: "gray",
      style: {
        backgroundColor: "#276b9c",
        paddingTop: 4
      },
      //lablePosition:"beside-icon",
      lableStyle: {
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold"
      },
      indicatorStyle: {
        borderBottomColor: "white",
        borderBottomWidth: 70
      }
    }
  }
);

tabNavigator.path = "";

export default tabNavigator;