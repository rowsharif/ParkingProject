import React from "react";
import { ExpoLinksView } from "@expo/samples";
import { Avatar } from "react-native-elements";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

function CNAQ_Parking_App() {
  const navigationOptions = {
    drawerLabel: "Parking Project App",
  };
  return (
    <ImageBackground
      source={require("../assets/images/bg11.jpeg")}
      style={{ width: "100%", height: "100%" }}
    >
      <ScrollView>
        <Text>Hello from the other side!</Text>
      </ScrollView>
    </ImageBackground>
  );
}

function Guide() {
  const navigationOptions = {
    drawerLabel: "Guide",
  };
  return (
    <ImageBackground
      source={require("../assets/images/bg11.jpeg")}
      style={{ width: "100%", height: "100%" }}
    >
      <ScrollView>
        <Text>Guide from the other side!</Text>
      </ScrollView>
    </ImageBackground>
  );
}
const MyDrawerNavigator = createDrawerNavigator({
  CNAQ_Parking_App: {
    screen: CNAQ_Parking_App,
  },
  Guide: {
    screen: Guide,
  },
});

const AppContainer = createAppContainer(MyDrawerNavigator);

export default function MyProfileScreen() {
  return <AppContainer />;
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
        About
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
    paddingTop: 15,
    backgroundColor: "#fff",
  },
});
