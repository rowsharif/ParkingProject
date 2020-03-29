// must use require for node
// also must do the following to fix firebase bug:
// - yarn install base-64 package to fix bug
// - modify firebase version in package.json to "7.11.0"
// - do a yarn install
// - change App.js to fix bug (see top of file)

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";

// simulate activity in firestore db
// change as necessary for your own db schema and needs

// delay between simulations (sec)
// - do not make too small or google will limit you
const DELAY = 10;

// an array to be filled from db
// - change to suit your own db schema and simulation needs
let Parkings = [];

const init = async () => {
  // // do once only, not a listener
  // const querySnapshot = await db
  //   .collection("ParkingLots")
  //   .get()
  //   .then(querySnapshot => {
  //     querySnapshot.forEach(doc => {
  //       db.collection("ParkingLots")
  //         .doc(doc.id)
  //         .collection("Parkings")
  //         .onSnapshot(querySnapshot => {
  //           Parkings = Parkings.filter(p => p.fk !== doc.id);
  //           querySnapshot.forEach(docP => {
  //             Parkings.push({ fk: doc.id, id: docP.id, ...docP.data() });
  //           });
  //         });
  //     });
  //   });

  const querySnapshot = await db
    .collection("ParkingLots")
    .doc("kECljqmSifLwfkpX6qPy")
    .collection("Parkings")
    .onSnapshot(querySnapshot => {
      Parkings = [];
      querySnapshot.forEach(docP => {
        Parkings.push({
          fk: "kECljqmSifLwfkpX6qPy",
          id: docP.id,
          ...docP.data()
        });
      });
    });

  console.log("done init: ", Parkings);
};

const simulate = async () => {
  // get necessary data from db for simulation to start
  await init();

  // simulate something (e.g. db update) every DELAY seconds
  setInterval(async () => {
    // select a random item
    const i = Math.floor(Math.random() * Parkings.length);

    // change it somehow
    // - must modify local copy of db data
    //   to avoid reloading from db
    const rnd = Math.floor(Math.random() * 2);

    Parkings[i].status = rnd;

    // update the db
    const { fk, id, ...Parking } = Parkings[i];
    await db
      .collection("ParkingLots")
      .doc(fk)
      .collection("Parkings")
      .doc(id)
      .set(Parking);

    console.log("simulated with item[", i, "]:id: ", id, "Parking", Parking);
  }, DELAY * 1000);
};

// start simulation
// - don't let it run all day and night or google will limit you
simulate();
