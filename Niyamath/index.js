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
      text: `Welcome to ${user.displayName}`
    });
  });

// 2
exports.sendMessage = functions.https.onCall(async (data, context) => {
  console.log("sendMessage data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.text === "") {
    console.log("empty message");
    return;
  }
  data = await bot(data);
  db.collection("messages").add(data);
});

/////////handle services
exports.handleServices = functions.https.onCall(async (data, context) => {
  console.log("service data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("Services").add(data.service);
  } else if (data.operation === "delete") {
    db.collection("Services")
      .doc(data.service.id)
      .delete();
  } else {
    db.collection("Services")
      .doc(data.service.id)
      .update(data.service);
  }
});
exports.handleNearestBuilding = functions.https.onCall(async (data, context) => {
  console.log("NearestBuilding data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("NearestBuildings").add(data.NearestBuilding);
  } else if (data.operation === "delete") {
    db.collection("NearestBuildings")
      .doc(data.NearestBuilding.id)
      .delete();
  } else {
    db.collection("NearestBuildings")
      .doc(data.NearestBuilding.id)
      .update(data.NearestBuilding);
  }
});

///////handle handleCRUDParkings
exports.handleCRUDParkings = functions.https.onCall(async (data, context) => {
  console.log("parking data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("ParkingsLots").doc(data.parking.fk).collection("Parkings").add(data.Parking);
  } else if (data.operation === "delete") {
    db.collection("ParkingsLots").doc(data.parking.fk).collection("Parkings")
      .delete();
  } else {
    db.collection("ParkingsLots").doc(data.parking.fk).collection("Parkings")
      .doc(data.parking.id)
      .update(data.parking);
  }
});

/////handle parking LOT
exports.handleParkingLot = functions.https.onCall(async (data, context) => {
  console.log("handleParkingLot data", data);
  // check for things not allowed
  // only if ok then add message
  if (data.operation === "add") {
    db.collection("ParkingLots").add(data.parkingLot);
  } else if (data.operation === "delete") {
    db.collection("ParkingLots")
      .doc(data.parkingLot.id)
      .delete();
  } else {
    db.collection("ParkingLots")
      .doc(data.parkingLot.id)
      .update(data.parkingLot);
  }
});

const bot = async message => {
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
  console.log("updateUser data", data.uid);
  const result = await admin.auth().updateUser(data.uid, {
    displayName: data.displayName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    photoURL: data.photoURL
  });
});

// 4
exports.initUser = functions.https.onRequest(async (request, response) => {
  console.log("request", request.query.data.uid);

  const result = await admin.auth().updateUser(request.query.data.uid, {
    displayName: "Unknown",
    photoURL:
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
  });
  console.log("after set", result);

  const listUsersResult = await admin.auth().listUsers(1000);

  listUsersResult.users.forEach(userRecord => {
    console.log("user", userRecord.toJSON());
  });

  response.send("All done ");
});

// 2
exports.handleParkings = functions.https.onCall(async (data, context) => {
  console.log("handleParkings data", data.crew.name);
  // temp,
  // car,
  // promotion
  // ServicesToAdd,
  //crew,
  // operation
  // hours
  let total = 0;

  let car = data.car;
  let sta = [];
  if (data.operation === "Park") {
    //add History
    const history = await db.collection("History").add({
      CarId: car.id,
      ParkingId: data.temp.id,
      DateTime: new Date(),
      Duration: {},
      TotalAmount: {}
    });

    if (data.car.Parking.status === 1) {
      sta = car.Parking.ServicesToAdd;
    } else {
      sta = data.ServicesToAdd;
    }
    total = sta.reduce(
      (previousScore, currentScore, index) =>
        previousScore + currentScore.price,
      0
    );
    //add UserServices
    sta.map(Service => {
      return db
        .collection("ParkingLots")
        .doc(data.temp.fk)
        .collection("Crew")
        .doc(data.crew.id)
        .collection("UserServices")
        .add({
          CarId: car.id,
          ServiceId: Service.id,
          ParkingId: data.temp.id,
          DateTime: new Date(),
          EmployeeId: {}
        });
    });
    car.Parking = data.temp;
    // save for later
    car.Parking["DateTime"] = new Date();
    car.Parking["HistoryId"] = history.id;
    car.Parking["TotalAmount"] = total;
    car.Parking["ServicesToAdd"] = sta;
  } else if (data.operation === "Reserve") {
    car.Parking = data.temp;
    // save for later
    car.Parking["ServicesToAdd"] = data.ServicesToAdd;
  } else if (data.operation === "CancelReservation") {
    car.Parking = {};
  } else {
    //Leave

    let pTotal =
      data.hours * car.Parking.amountperhour + car.Parking.TotalAmount;
    let totalAmount =
      data.promotion && data.promotion.percent
        ? pTotal - pTotal * data.promotion.percent
        : pTotal;
    totalAmount = Math.floor(totalAmount);
    //add Payment (Services,Promotion, Parking AmountPerHour)
    db.collection("Payment").add({
      CarId: car.id,
      ParkingId: data.temp.id,
      ServicesIds: data.car.Parking.ServicesToAdd,
      TotalAmount: totalAmount,
      Duration: data.hours
    });
    //update History
    let h = {};
    let dHistory = db
      .collection("History")
      .doc(car.Parking.HistoryId)
      .get(snapshot => {
        snapshot.forEach(doc => {
          h = doc.data();
        });
      });
    h.id = car.Parking.HistoryId;
    h.TotalAmount = totalAmount;
    h.Duration = data.hours;
    db.collection("History")
      .doc(car.Parking.HistoryId)
      .update(h);
    car.Parking = {};
  }

  db.collection("ParkingLots")
    .doc(data.temp.fk)
    .collection("Parkings")
    .doc(data.temp.id)
    .update(data.temp);

  db.collection("users")
    .doc(car.fk)
    .collection("Cars")
    .doc(car.id)
    .update(car);
});
