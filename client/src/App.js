import React from "react";
import axios from "axios";

import "./App.css";
import HomePage from "./components/HomePage";
import QueriesPage from "./components/QueriesPage";

class App extends React.Component {
 
  grantAccessToLocationData = async () => {
    var latitude, longitude, location_data;
    var ts = Date.now();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position);
        latitude = await position.coords.latitude.toFixed(7);
        longitude = await position.coords.longitude.toFixed(7);
        location_data = {
          patient_name: "weird name",
          patient_id: 1,
          x: latitude,
          y: longitude,
          timestamp: ts,
        };
        console.log(location_data);
        try {
          var res = await axios.post(
            "http://127.0.0.1:3000/send_location_securely", location_data
          );
          console.log(res.data);
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      console.log("Browser doesn't support geo-location");
    }
  };

  render() {
    return (
      <div className="App">
        <HomePage></HomePage>
        <QueriesPage></QueriesPage>
</div>
    
    );
  }
}

export default App;
