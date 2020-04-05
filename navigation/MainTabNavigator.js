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

//React Navigation's stack navigator provides a way for your app to transition between screens and manage navigation history

// Platform detects the platform in which the app is running
// in case the platform is web then heafermode is screen ;otherwise, Android or iOS it will stay default
const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});
// createStackNavigator is a function that returns a React compone
// it takes a route configuration object and, optionally, an options object
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  config
);
//navigationOptions - Navigation options for the navigator itself, to configure a parent navigator
//tabBarLabel prop specify the title of the page navigation in the navigation bar
//tabBarIcon prop  specify the icon of the page navigation in the navigation bar
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
//paths - A mapping of overrides for the paths set in the route configs
HomeStack.path = "";
// The action and route params are extracted from the path.


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

// createMaterialBottomTabNavigator - A material-design themed tab bar on the bottom of the screen that lets you switch between different routes with animation. Routes are lazily initialized - their screen components are not mounted until they are first focused.
//This wraps the BottomNavigation component from react-native-paper.
//inside it is the list of stacks to be displayed
const tabNavigator = createMaterialBottomTabNavigator(
  {
    HomeStack,
    CampusMapStack,
    MyProfileStack,
    AboutStack,
    NewsletterStack
  },
  {
    //swipeEnabled - Whether to allow swiping between tabs.
    swipeEnabled: true,
    //animationEnabled - Whether to animate when changing tabs.
    animationEnabled: true,
    //activeColor - Custom color for icon and label in the active tab.
    activeColor: "white",
    //inactiveColor - Custom color for icon and label in the inactive tab.
    inactiveColor: "gray",
    //barStyle - Style for the bottom navigation bar.
    barStyle: { backgroundColor: "#276b9c" },
    // tabBarOptions - Configure the tab bar
    tabBarOptions: {
      //activeTintColor - Label and icon color of the active tab
      activeTintColor: "white",
      //inactiveTintColor - Label and icon color of the inactive tab.
      inactiveTintColor: "gray",
      //style - Style object for the tab bar.
      style: {
        backgroundColor: "#276b9c",
        paddingTop: 4
      },
      //labelStyle - Style object for the tab label.
      lableStyle: {
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold"
      },
      //indicatorStyle - Style object for the tab indicator (line at the bottom of the tab).
      indicatorStyle: {
        borderBottomColor: "white",
        borderBottomWidth: 70
      }
    }
  }
);

tabNavigator.path = "";

export default tabNavigator;
