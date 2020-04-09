// firebase functions to create cloud functions and setup an action.
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// 1
exports.welcomeUser = functions.firestore
  .document("users/{uid}")
  .onWrite(async (change, context) => {
    console.log("uid", context.params.uid);
    const user = await admin.auth().getUser(context.params.uid);

    db.collection("messages").add({
      from: user.uid,
      to: "Everyone",
      text: `Welcome to ${user.displayName}`,
    });
  });

// 2
exports.sendMessage = functions.https.onCall(async (data, context) => {
  console.log("sendMessage data", data);
  
  if (data.text === "") {
    console.log("empty message");
    return;
  }
  data = await bot(data);
  db.collection("messages").add(data);
});

/////////handleservices method takes two parameters: data, and optional context
exports.handleServices = functions.https.onCall(async (data, context) => {
  ///the method first checks if the operation is "add"
  if (data.operation === "add") {
    ///then the data object will be added to the database using the query
    db.collection("Services").add(data.service);
  }
  
  ///if not, the it will check if the data operation is "delete" 
else if (data.operation === "delete") {
  //it will delete the object from the database refering to the id(document) of the object called using a query
    db.collection("Services").doc(data.service.id).delete();
  } 
  ///if none of the above conditions match

  else {
    ///then it will edit the object existing in the database by refering the id(document) in the database and send back the new edited object to the database using a query
    db.collection("Services").doc(data.service.id).update(data.service);
  }
});

exports.handleParkingLot = functions.https.onCall(async (data, context) => {
  console.log("service data", data);

  if (data.operation === "add") {
    db.collection("ParkingLots").add(data.parkingLot);
  } else if (data.operation === "delete") {
    db.collection("ParkingLots").doc(data.parkingLot.id).delete();
  } else {
    db.collection("ParkingLots")
      .doc(data.parkingLot.id)
      .update(data.parkingLots);
  }
});

exports.handlePromotion = functions.https.onCall(async (data, context) => {
  console.log("service data befor", data.promotion.endDateTime);
  data.promotion.endDateTime = new Date(data.promotion.endDateTime);
  console.log("service data", data.promotion.endDateTime);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("Promotions").add(data.promotion);
  } else if (data.operation === "delete") {
    db.collection("Promotions").doc(data.promotion.id).delete();
  } else {
    db.collection("Promotions").doc(data.promotion.id).update(data.promotion);
  }
});

exports.handleCrew = functions.https.onCall(async (data, context) => {
  console.log("service data", data);
  if (data.operation === "add") {
    db.collection("ParkingLots")
      .doc(data.crew.fkp)
      .collection("Crew")
      .add(data.crew);
  } //if the operation is delete
  else if (data.operation === "delete") {
    db.collection("ParkingLots")
      .doc(data.crew.fkp) // the id of the Crew's ParkingLot; the variable data.crew.fkp came as a parameter to the function
      .collection("Crew")
      .doc(data.crew.id) // the id of the Crew; the variable data.crew.id came as a parameter to the function
      .delete();
  } else {
    db.collection("ParkingLots")
      .doc(data.crew.fkp)
      .collection("Crew")
      .doc(data.crew.id)
      .update(data.crew);
  }
});

exports.handleEmployee = functions.https.onCall(async (data, context) => {
  console.log("service data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("ParkingLots")
      .doc(data.employee.fkp)
      .collection("Crew")
      .doc(data.employee.fk)
      .collection("Employee")
      .add(data.employee);
  } else if (data.operation === "delete") {
    db.collection("ParkingLots")
      .doc(data.employee.fkp)
      .collection("Crew")
      .doc(data.employee.fk)
      .collection("Employee")
      .doc(data.employee.id)
      .delete();
  } else {
    db.collection("ParkingLots")
      .doc(data.employee.fkp)
      .collection("Crew")
      .doc(data.employee.fk)
      .collection("Employee")
      .doc(data.employee.id)
      .update(data.employee);
  }
});

/////////handle newsletter
exports.handleNewsletter = functions.https.onCall(async (data, context) => {
  console.log("Newsletter data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("newsletter").add(data.newsletter);
  } else if (data.operation === "delete") {
    db.collection("newsletter").doc(data.newsletter.id).delete();
  } else {
    db.collection("newsletter").doc(data.newsletter.id).update(data.newsletter);
  }
});

const bot = async (message) => {
  const user = await admin.auth().getUser(message.from);
  // do something based on the message

  if (message.text.charAt(0) === "!") {
    if (message.text === "!greetme") {
      message.text = `Hello to ${user.displayName}`;
      message.from = "bot";
      message.to = "Everyone";
    }
  }
  return message;
};

// 3
exports.updateUser = functions.https.onCall(async (data, context) => {
  console.log("updateUser data", data.phoneNumber);
  const result = await admin.auth().updateUser(data.uid, {
    displayName: data.displayName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    photoURL: data.photoURL,
  });
});

// 4
exports.initUser = functions.https.onRequest(async (request, response) => {
  console.log("request", request.query.data.uid);

  const result = await admin.auth().updateUser(request.query.data.uid, {
    displayName: "Unknown",
    photoURL:
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
  });
  console.log("after set", result);

  const listUsersResult = await admin.auth().listUsers(1000);

  listUsersResult.users.forEach((userRecord) => {
    console.log("user", userRecord.toJSON());
  });

  response.send("All done ");
});

exports.handleNearestBuilding = functions.https.onCall(
  async (data, context) => {
    console.log("NearestBuilding data", data);
    // check for things not allowed
    // only if ok then add message
    if (data.operation === "add") {
      db.collection("NearestBuildings").add(data.nearestBuilding);
    } else if (data.operation === "delete") {
      db.collection("NearestBuildings").doc(data.nearestBuilding.id).delete();
    } else {
      db.collection("NearestBuildings")
        .doc(data.nearestBuilding.id)
        .update(data.nearestBuilding);
    }
  }
);
///////handle handleCRUDParkings
exports.handleCRUDParkings = functions.https.onCall(async (data, context) => {
  console.log("parking data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("ParkingsLots")
      .doc(data.parking.fk)
      .collection("Parkings")
      .add(data.Parking);
  } else if (data.operation === "delete") {
    db.collection("ParkingsLots")
      .doc(data.parking.fk)
      .collection("Parkings")
      .delete();
  } else {
    db.collection("ParkingsLots")
      .doc(data.parking.fk)
      .collection("Parkings")
      .doc(data.parking.id)
      .update(data.parking);
  }
});

exports.handleParkingLot = functions.https.onCall(async (data, context) => {
  console.log("service data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("ParkingLots").add(data.parkingLot);
  } else if (data.operation === "delete") {
    db.collection("ParkingLots").doc(data.parkingLot.id).delete();
  } else {
    db.collection("ParkingLots")
      .doc(data.parkingLot.id)
      .update(data.parkingLots);
  }
});

// 2
exports.handleParkings = functions.https.onCall(async (data, context) => {
  console.log("handleParkings data", data.uid);
  //bellow are the data variables coming from the database
  // temp= The parking object involved in operations,
  // car= The user car object,
  // promotion= object that contains a discount percentage
  // ServicesToAdd= services The user want to be completed,
  //crew= Which crew to add the services to complete to
  // operation= the operation the user want to do "Leave", "park", "Reserve", or "CancelReservation" of a parking
  // hours = number of hours the user was parked for

  //Setting the initial value of total to 0
  let total = 0;
  //Making the variable car equal to the car object coming from the database; For easy usage
  let car = data.car;
  // Setting the variable sta to include all the services that the user choses to be entered to the database as (UserServices collection) in a later stage
  let sta = [];

  //If the user "Park"
  if (data.operation === "Park") {
    //add History to the database
    //await: used to make the function wait until the operation add to be compleated (until the promise settles)
    const history = await db.collection("History").add({
      Car: car, //save car object
      Parking: data.temp, //save Parking object
      DateTime: new Date(), //current date and time
      Duration: {}, //Left as an empty object to determine that the user is still on campus
      TotalAmount: {}, //Left as an empty object to determine that the user is still on campus
      uid: data.uid, //The id of the user
    });

    //If the status of the parking is 0 that means its empty, 1 is reserved, and 2 is full
    if (data.car.Parking.status === 1) {
      //set the variable sta to the services that are saved in the parking object inside the car object (because the parking was reserved and that where the services were restored)
      sta = car.Parking.ServicesToAdd;
    } else {
      //set the variable sta to the services that came from the parameter data
      sta = data.ServicesToAdd;
    }
    //seting the total to the sum of the services price
    total = sta.reduce(
      (previousScore, currentScore, index) =>
        previousScore + parseInt(currentScore.price),
      0
    );
    //add UserServices objects to the collection "UserServices"
    sta.map((Service) => {
      return db
        .collection("ParkingLots")
        .doc(data.temp.fk) // the parking lot of the parking
        .collection("Crew")
        .doc(data.crew.id) // the crew of that parking
        .collection("UserServices")
        .add({
          Car: car.PlateNumber,
          ServiceName: Service.name,
          ParkingId: data.temp.id,
          DateTime: new Date(),
          EmployeeId: "", //Determines that none of the employees completed this service
        });
    });
    car.Parking = data.temp; //setting the parking from the parameter to the user car object
    // save for later use ("Leave" operation)
    car.Parking["DateTime"] = new Date(); //the date and the time when the user parked
    car.Parking["HistoryId"] = history.id; //the History Id to use later for update
    car.Parking["TotalAmount"] = total; // the total amount of all requested services
    car.Parking["ServicesToAdd"] = sta; //save all requested services to the car->parking object

    //If the user "Reserve" a parking
  } else if (data.operation === "Reserve") {
    car.Parking = data.temp; //setting the parking from the parameter to the user car object
    // save for later use ("Park" operation)
    car.Parking["ServicesToAdd"] = data.ServicesToAdd; //save all requested services came through the function parameter to the car->parking object
  }
  //If the user "CancelReservation" of a parking
  else if (data.operation === "CancelReservation") {
    //setting the car->parking object to an empty object to etermine that the car is not parked in any cnaq parking
    car.Parking = {};
  }
  //If the user "Leave" a parking
  else {
    // pTotal is temp variable used to store the total amount of the parking and services;
    //it equals the number of hours the user spent on the parking multiplied by the parking amount per an hour plus the total amount of all services requested by the user.
    let pTotal =
      data.hours * car.Parking.amountperhour + car.Parking.TotalAmount;
    // the totalAmount variable is used to store the total amount after discount if there is any; otherwise it equals to the ptotal variable
    let totalAmount =
      data.promotion && data.promotion.percent
        ? pTotal - pTotal * data.promotion.percent
        : pTotal;
    //rounding the totalAmount to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;
    // When leaving the parking a payment object will be created in the “payment” collection in the database
    db.collection("Payment").add({
      Car: car, // the user car object
      Parking: data.temp, // the parking object
      ServicesIds: data.car.Parking.ServicesToAdd, //All requested services
      TotalAmount: totalAmount, //the total amount
      Duration: data.hours, // the Duration
      uid: data.uid, // the user Id
      DateTime: new Date(), //the date and time when the user left
      // the promotion percent if there is any, otherwise "0"
      promotion:
        data.promotion && data.promotion.percent
          ? data.promotion.percent * 100
          : 0,
    });

    //update the History object in the History collection in the database
    let h = {};
    let dHistory = db
      .collection("History")
      .doc(car.Parking.HistoryId) //useing the id saved earlier in the car->parking object to get the History object
      .get((snapshot) => {
        snapshot.forEach((doc) => {
          h = doc.data(); //saving the History object in the temp variable "h"
        });
      });
    h.id = car.Parking.HistoryId; // adding the id to the "h" variable since it dose not come with doc.data()
    h.TotalAmount = totalAmount; // adding the total Amount
    h.Duration = data.hours; // adding Duration
    db.collection("History").doc(car.Parking.HistoryId).update(h); // updating the History object in the database by setting it to variable "h"
    //setting the car->parking object to an empty object to etermine that the car is not parked in any cnaq parking
    car.Parking = {};
  }
  //  updating the Parking object in the "Parkings" collection in the database by setting it to the parking variable that came from the parameter "temp"
  db.collection("ParkingLots")
    .doc(data.temp.fk) //the ParkingLot id saved in temp object as fk
    .collection("Parkings")
    .doc(data.temp.id) //the Parking id
    .update(data.temp);

  // updating the Car object in the "Cars" collection in the database by setting it to the car variable "car"
  db.collection("users")
    .doc(car.fk) //the user id saved in car object as fk
    .collection("Cars")
    .doc(car.id) //the car id
    .update(car);
});
