import React from "react";
import { ExpoLinksView } from "@expo/samples";
import {
  Avatar,
  Card,
  ListItem,
  Icon,
  PricingCard,
  Tooltip,
} from "react-native-elements";
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
  SafeAreaView,
  Alert,
} from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome5Brands,
} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Linking } from "expo";
import firebase from "firebase/app";
import "firebase/auth";
console.disableYellowBox = true;

function CNAQ_Parking_App() {
  const navigationOptions = {
    drawerLabel: "Parking Project App",
  };
  return (
    <ImageBackground
      source={require("../assets/images/bg11.jpeg")}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          backgroundColor: "#bfbfbf",
          height: "75%",
          borderRadius: 5,
          marginTop: "15%",
          marginBottom: "15%",
          margin: "4%",
        }}
      >
        <Text style={styles.titleText}>About Us</Text>
        <ScrollView>
          <Text style={{ fontSize: 20, margin: "12%", textAlign: "justify" }}>
            CNA-Q Parking App is designed for the students and faculty members
            of CNA-Q by the group RANA, allowing useful functionality supporting
            the needs of people parking at CNA-Q.
          </Text>
          <Text
            style={{
              color: "blue",
              fontSize: 14,
              margin: "5%",
              textAlign: "justify",
            }}
            onPress={() =>
              Linking.openURL(
                "https://www.cna-qatar.com/currentstudents/campusmapdirectory"
              )
            }
          >
            More About CNA-Q Campus
          </Text>
        </ScrollView>
      </View>
      <View style={{ alignSelf: "center" }}>
        <Tooltip
          height={130}
          width={300}
          popover={
            <View>
              <Text>
                <Text style={{ color: "#276b9c" }}>R</Text>owida Yousif -
                60090962
              </Text>
              <Text>
                <Text style={{ color: "#276b9c" }}>A</Text>watif Al-Busaidy -
                60087183
              </Text>
              <Text>
                <Text style={{ color: "#276b9c" }}>N</Text>iyamath Yusuf -
                60091929
              </Text>
              <Text>
                <Text style={{ color: "#276b9c" }}>A</Text>bdul Muksith Rizvi -
                60092545
              </Text>
            </View>
          }
        >
          <Text style={{ color: "#276b9c" }}>© RANA</Text>
        </Tooltip>
      </View>
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
      <Text style={styles.titleText}>Guide</Text>
      <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: "#bfbfbf",
            height: "100%",
            borderRadius: 5,
            margin: "4%",
          }}
        >
          {/* <Text style={styles.head}>Normal Line Parking</Text> */}
          <View style={styles.container2}>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/green.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "black",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Available parking</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/yellow.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "black",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Reserved Parking</Text>
            </View>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      margin: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/red.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "black",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Parking is Full</Text>
            </View>
          </View>
          <View style={styles.container2}>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: "70%",
                  height: "40%",
                }}
              >
                <MaterialCommunityIcons
                  name="car-brake-parking"
                  size={30}
                  color="purple"
                  style={{ textAlign: "center" }}
                />
              </View>
              <Text style={styles.txt}>User Parked </Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: "70%",
                  height: "40%",
                }}
              >
                <MaterialCommunityIcons
                  name="registered-trademark"
                  size={30}
                  color="purple"
                  style={{ textAlign: "center" }}
                />
              </View>
              <Text style={styles.txt}>User Reserved</Text>
            </View>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginRight: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/sat.png")}
                style={{ width: "70%", height: "40%" }}
              ></Image>
              <Text style={styles.txt}>Press long for satellite</Text>
            </View>
          </View>
          <View style={styles.container2}>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/green.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "#7232fc",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Employee Parking</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/green.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "#fc8a32",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Vip Parking</Text>
            </View>
            <View
              style={[
                {
                  backgroundColor: "#bfbfbf",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            ></View>
          </View>

          <Text style={styles.head}>Gold Line Parking</Text>
          <View style={styles.container2}>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/green.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "gold",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Available parking</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/yellow.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "gold",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Reserved Parking</Text>
            </View>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginRight: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/red.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "gold",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Parking is Full</Text>
            </View>
          </View>
          <Text style={styles.head}>Sliver Line Parking</Text>
          <View style={styles.container2}>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/green.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "#bfbfbf",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Available parking</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      marginLeft: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/yellow.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "#bfbfbf",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Reserved Parking</Text>
            </View>
            <View
              style={[
                {
                  backgroundColor: "#fffaf0",
                  ...Platform.select({
                    ios: {
                      margin: 7,
                    },
                    android: {
                      marginTop: 15,
                      margin: 15,
                    },
                  }),
                },
                styles.vFormat,
              ]}
            >
              <Image
                source={require("../assets/images/red.png")}
                style={{
                  width: "70%",
                  height: "40%",
                  borderColor: "#bfbfbf",
                  borderWidth: 3,
                }}
              ></Image>
              <Text style={styles.txt}>Parking is Full</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
function Payment() {
  const navigationOptions = {
    drawerLabel: "About payment ",
  };
  return (
    <ImageBackground
      source={require("../assets/images/bg11.jpeg")}
      style={{ width: "100%", height: "100%" }}
    >
      <ScrollView>
        <Text style={styles.titleTexts}>Payment</Text>
        <View style={styles.container3}>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/green.png")}
              style={{
                width: "70%",
                height: "40%",
                borderColor: "gold",
                borderWidth: 3,
              }}
            ></Image>
            <Text style={styles.titleTexts}>Gold</Text>
            <Text style={styles.txts}>3QR/Hour</Text>
          </View>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/green.png")}
              style={{
                width: "70%",
                height: "40%",
                borderColor: "white",
                borderWidth: 3,
              }}
            ></Image>
            <Text style={styles.titleTexts}>Sliver</Text>
            <Text style={styles.txts}>2QR/Hour</Text>
          </View>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/green.png")}
              style={{
                width: "70%",
                height: "40%",
                borderColor: "black",
                borderWidth: 3,
              }}
            ></Image>
            <Text style={styles.titleTexts}>Normal</Text>
            <Text style={styles.txts}>1QR/Hour</Text>
          </View>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/em.png")}
              style={{ width: "75%", height: "40%", borderWidth: 3 }}
            ></Image>
            <Text style={styles.titleTexts}>Staff & Vip</Text>
            <Text style={styles.txts}>Do not pay except for services</Text>
          </View>
        </View>
        <Text style={styles.titleTexts}>Services</Text>
        <View style={styles.container3}>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/carw.png")}
              style={{ width: "60%", height: "50%" }}
            ></Image>
            <Text style={styles.titleTexts}>Full Wash</Text>
            <Text style={styles.txts}>15QR</Text>
          </View>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/carh.png")}
              style={{ width: "70%", height: "40%" }}
            ></Image>
            <Text style={styles.titleTexts}>Half Wash</Text>
            <Text style={styles.txts}>10QR</Text>
          </View>
          <View
            style={[
              {
                backgroundColor: "#bfbfbf",
                ...Platform.select({
                  ios: {
                    margin: 7,
                  },
                  android: {
                    marginTop: 15,
                    margin: 15,
                  },
                }),
              },
              styles.vFormats,
            ]}
          >
            <Image
              source={require("../assets/images/carp.png")}
              style={{ width: "70%", height: "40%" }}
            />
            {ios && <Text>fgtnj</Text>}
            <Text style={styles.titleTexts}>Petrol</Text>
            <Text style={styles.txts}>10QR</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
const MyDrawerNavigator = createDrawerNavigator(
  {
    About: {
      screen: CNAQ_Parking_App,
    },
    Guide: {
      screen: Guide,
    },
    Payment: {
      screen: Payment,
    },
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1 }}>
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
      </View>
    ),
  }
);

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
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 10,
  },
  titleTexts: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 10,
  },
  txts: {
    ...Platform.select({
      ios: {},
      android: {
        fontFamily: "serif",
      },
    }),
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
  card: {
    width: "10%",
    height: "10%",
  },
  container1: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  container2: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  txt: {
    ...Platform.select({
      ios: {},
      android: {
        fontFamily: "serif",
      },
    }),
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
  vFormat: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  container3: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 15,
  },

  vFormats: {
    width: 160,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  head: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 10,
    fontWeight: "bold",
  },
});
