import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";

//createAppContainer is a function that returns a React component to take as a parameter the React component created by the createStackNavigator, and can be directly exported from App.js to be used as our App's root component.

export default createAppContainer(

  /////////createSwitchNavigator is used to show only one screen at a time. By default it does not handle back any action and sets all the routes to default state
  /////This page is called in the app.js file
  
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
  })
);
//this page will be callde from App.js
