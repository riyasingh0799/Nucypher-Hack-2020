"use strict";
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const ipfsClient = require("ipfs-http-client");
var assert = require("assert");
const axios = require("axios");
const { execSync } = require("child_process");
const childprocess = require("child_process");

const app = express();
const MongoClient = require("mongodb").MongoClient;

var connection_string =
  "mongodb+srv://user1:user1@cluster0.nrbaz.mongodb.net/nuLocationDB?retryWrites=true&w=majority";
// var url = "mongodb://localhost:27017/mydb";


function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

async function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c * 1000.0; 
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/is_near_primary_location", async (req, res) => {
  if (req.query.patient_id && req.query.x && req.query.y) {
    MongoClient.connect(connection_string, { useUnifiedTopology: true }).then(
      async (client) => {
        const db = client.db("nuLocationDB");

        try {
          var patient = await db.collection("patients").findOne({patient_id: parseInt(req.query.patient_id)})
          var x_primary = patient.primary_location.x
          var y_primary = patient.primary_location.y
          var x_current = req.query.x
          var y_current = req.query.y
          var distance = await distanceInMBetweenEarthCoordinates(x_primary, y_primary, x_current, y_current)
          var is_near
          if(parseInt(distance>10))
            is_near = false
          else
            is_near = true
          
          var distance_data = {
            "distance": distance,
            "is_near": is_near
          }
          console.log(distance_data)
          return res.jsonp(distance_data)
        }
        catch(e) {
          console.log(e)
          }
        
      }
    );
  } else {
    console.log("no data received");
  }
  const policy_data = await axios.post("http://127.0.0.1:8151/derive_policy_encrypting_key/location_detail");
    console.log(policy_data)
    res.json(policy_data.data.result)
})

app.get("/get_policy_key", async (req, res) => {
  const policy_data = await axios.post("http://127.0.0.1:8151/derive_policy_encrypting_key/location_detail");
    console.log(policy_data)
    res.json(policy_data.data.result)
})

app.get("/get_patient_details", (req, res) => {

  if (req.query.patient_id) {
    MongoClient.connect(connection_string, { useUnifiedTopology: true }).then(
      async (client) => {
        const db = client.db("nuLocationDB");

        try {
          var patient = await db.collection("patients").findOne({patient_id: parseInt(req.query.patient_id)})
          console.log(patient)
          res.json(patient)
        }
        catch(e) {
          console.log(e)
          }
        
      }
    );
  } else {
    console.log("no data received");
  }
});

app.post("/enter_new_patient", (req, res) => {
  if (req.body) {
    MongoClient.connect(connection_string, { useUnifiedTopology: true }).then(
      (client) => {
        const db = client.db("nuLocationDB");
        const patients = db.collection("patients");

        var patient_data = req.body
        patient_data.patient_id = Math.floor(Date.now()+Math.random()*1000000000000)
        patient_data.quarantine_begin = Date.now()
        patient_data.quarantine_end = Date.now() + 14*86400

        patients
          .insertOne(patient_data)
          .then((result) => {
            console.log(result);
            res.json(result)
            // res.send(patient_data.patient_id);
            // res.send("Added");
          })
          .catch((error) => console.error(error));
      }
    );
  } else {
    console.log("no data received");
  }
});

app.post("/query_patient_location", (req, res) => {

  if (req.body) {
    MongoClient.connect(connection_string, { useUnifiedTopology: true }).then(
      (client) => {
        const db = client.db("nuLocationDB");
        const queries = db.collection("queries");
        var query_data = req.body
        query_data.query_timestamp = Date.now()
        var patient = db.collection("patients").findOne({patient_id: req.body.patient_id})
        // if(patient.quarantine_end>=Date.now()) {
          if(true){
          queries
          .insertOne(query_data)
          .then((result) => {
            res.json(result);
          })
          .catch((error) => console.error(error));
        }
        // else {
        //   res.send("Cannot query user's location now that the quarantine period has ended.")
        // }
      }
    );
  } else {
    console.log("no data received");
  }
});

app.post("/grant_location_access", async (req, res) => {
  if (req.body) {
    console.log(req.body)
    const grant_url = "http://localhost:8151/grant";
    const public_keys_url = "http://localhost:4000/public_keys";
    const encrypt_message_url = "http://localhost:5000/encrypt_message";
    // const retrieve_url = "http://localhost:4000/retrieve";
    try {
      var public_keys = await axios.get(public_keys_url);
      console.log(public_keys.data.result)
      var encrypted_message = await axios.post(encrypt_message_url, {"message": JSON.stringify(req.body)} ,{'Content-Type': 'application/json'});
      console.log(encrypted_message)
      // var grant_data={
      //       bob_verifying_key: public_keys.data.result.bob_verifying_key,
      //       bob_encrypting_key: public_keys.data.result.bob_encrypting_key,
      //       m: 1,
      //       n: 1,
      //       label: "location_detail",
      //       expiration: "2020-12-14T09:53:25-0400",
      //     }

      var grant_result = await axios.put(grant_url, {
        "bob_verifying_key": public_keys.data.result.bob_verifying_key,
        "bob_encrypting_key": public_keys.data.result.bob_encrypting_key,
        "m": 1,
        "n": 1,
        "label": "location_detail",
        "expiration": "2020-12-14T09:53:25-0400",
      },{'Content-Type': 'application/json'});

      console.log(grant_result)
      var retrieve_query = {
        "policy_encrypting_key": grant_result.data.result.policy_encrypting_key, 
        "alice_verifying_key": grant_result.data.result.alice_verifying_key, 
        "label": "location_detail", 
        "message_kit": encrypted_message.data.result.message_kit
      }
      console.log(retrieve_query)

    res.json(retrieve_query)      
    
    } catch (e) {
      console.log(e);
      res.send("some mistake");
    }
    // await childprocess.exec(
    //   "cd .. && nucypher alice run --dev --federated-only --teacher 127.0.0.1:10151",
    //   async (e, stdout, stderr) => {
    //     console.log(stdout)
    //     console.log(stderr)

    //   }
    // );
    // }
    // catch(e) {
    //   console.log(e)
    // }
  } else {
    console.log("no data");
  }
});

app.get("/get_queries", async (req, res) => {
  if (req.query.id) {
    console.log(req.query.id);
    MongoClient.connect(connection_string, { useUnifiedTopology: true }).then(
      // assert.equal(null, err);
      async (client) => {
        const db = client.db("nuLocationDB");
        var result = await db
          .collection("queries")
          .find({ patient_id: parseInt(req.query.id) })
          .toArray(async (err, queries) => {
            if (err) throw err;
            res.jsonp(queries);
            // await res.send(JSON.parse(JSON.stringify(queries)));
            console.log(queries);
            // db.close();
          });
      }
    );
  } else {
    console.log("No id");
  }
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
