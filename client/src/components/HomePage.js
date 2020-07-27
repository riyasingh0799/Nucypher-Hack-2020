import React, { Component } from "react";
import axios from "axios";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
        showData: "none",
        patient_name: null,
        primary_location: null,
        primary_location_x: null,
        primary_location_y: null,
        quarantine_begin: null,
        quarantine_end: null,
    };
  }

  componentDidMount() {
    axios
      .get("http://127.0.0.1:3000/get_patient_details?patient_id=2561158935712")
      .then(async (res) => {
        var primary_location = res.data.primary_location
        var patient_data = res.data

        var quarantine_begin = res.data.quarantine_begin
        console.log(patient_data)
        this.setState({
            patient_name: patient_data.name,
            primary_location_x: primary_location.x,
            primary_location_y: primary_location.y ,
            quarantine_begin: quarantine_begin,
            quarantine_end: patient_data.quarantine_end,
            showData: "block"
        })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <React.Fragment>
        <h1 style = {{fontSize: '20px', color: "white", backgroundColor: "blue", height: '30px'}}>NuCypher Location Proofs</h1>

        <div style = {{display: this.state.showData, textAlign: 'left', margin: '5%', padding: '5%', boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)'}}>
        <p><strong>Patient's Name: </strong>{this.state.patient_name}</p>
        <p><strong>Patient's ID: </strong>1</p>
        <p>
        <strong>Primary Location: </strong>
        </p>
        <p><strong>X: </strong>{this.state.primary_location_x}</p>
        <p><strong>Y: </strong>{this.state.primary_location_y}</p>
        <p><strong>Quarantine Beginning Date: </strong>{this.state.quarantine_begin}</p>
        <p><strong>Quarantine Ending Date: </strong>{this.state.quarantine_end}</p>
      </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
