import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";
class QueriesPage extends Component {
  constructor() {
    super();
    this.state = {
      showQueries: "none",
      queries: [],
      queryList: null,
      policy_encrypting_key: null,
    };
  }

  componentDidMount() {
    axios
      .get("http://127.0.0.1:3000/get_queries?id=2482346265796")
      .then(async (res) => {
        // await this.state.queries.push(res.data);
        const listItems = res.data.map((query) => (
          <li key={query._id}>
            <div
              style={{
                display: this.state.showData,
                textAlign: "left",
                margin: "5%",
                padding: "5%",
                boxShadow: "0 100px 80px rgba(0, 0, 0, 0.12)",
              }}
            >
              <p>
                <strong>Organization: </strong>
                {query.queried_by}
              </p>
              <p>
                <strong>Organization's ID: </strong>
                {query.queried_by_org_id}
              </p>
              <p>
                <strong>Query Timestamp: </strong>
                {query.query_timestamp}
              </p>
              <div style={{textAlign: 'center', paddingTop: "30px", paddingBottom: "100px"}}>
                <Button variant="contained" style={{color: "blue", marginLeft: "0", marginRight: "auto"}} component="span">
                  Grant
                </Button>
                
              </div>
            </div>
          </li>
        ));
        this.setState({
          queryList: listItems,
        });
        await this.setState({
          showQueries: "block",
        });
      });

    axios.get("http://127.0.0.1:3000/get_policy_key").then((res) => {
      const policy_encrypting_key = res.data.policy_encrypting_key;
      this.setState({
        policy_encrypting_key: policy_encrypting_key,
      });
      console.log(this.state.policy_encrypting_key);
    });

    this.handleSendLocation = this.handleSendLocation.bind(this);
  }

  handleSendLocation = async (queryid) => {
    var latitude, longitude, time;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // latitude = position.coords.latitude;
        // longitude = position.coords.longitude;
        latitude = position.coords.latitude.toFixed(7);
        longitude = position.coords.longitude.toFixed(7);
        time = Date.now();
        console.log(latitude);
        console.log(longitude);

        try {
          var res = await axios.post(
            "http://127.0.0.1:3000/grant_location_access",
            {
              query_id: queryid,
              x: latitude,
              y: longitude,
              timestamp: time,
            }
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
      <React.Fragment>
        <h1
          style={{
            fontSize: "20px",
            color: "white",
            backgroundColor: "blue",
            height: "30px",
            display: this.state.showQueries,
          }}
        >
          Location Access Requests
        </h1>

        <div style={{ display: this.state.showQueries }}>
          {this.state.queryList}
        </div>
      </React.Fragment>

      // <ul>
      //   {this.state.queryList}
      //   </ul>
    );
  }
}

export default QueriesPage;
