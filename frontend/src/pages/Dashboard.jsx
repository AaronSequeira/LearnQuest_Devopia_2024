import React from "react";
import axios from "axios";
import { useState,useEffect } from "react";
import { loader } from '../assets';

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { Card, CardBody } from "@nextui-org/react";



const Dashboard = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      axios
        .get(`http://localhost:8000/currentUser`)
        .then((res) => {
          console.log(res.abilityScore);
        })
        .catch((e) => {
          console.log(e);
        });
      setIsLoading(false);
    }, 700);
  }, []);

  const progessData = [
    {
      name: "Jan",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "March",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "April",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "June",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "July",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>
      {isLoading && (
    <img
      src={loader}
      alt="loader"
      className="w-[100px] h-[100px] object-contain"
    />
  )
}
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div className="flex flex-row justify-between items-start gap-[50px] ">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginRight: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Card
              shadow="none"
              style={{
                width: "250px",
                height: "150px",
                border: "3px solid #1ec173",
                backgroundColor: "#13131a",
              }}
            >
              <CardBody style={{ fontSize: "1.2rem", textAlign: "center" }}>
                Your Ability Score:
              </CardBody>
            </Card>
            <Card
              style={{
                width: "250px",
                height: "150px",
                border: "3px solid #1ec173",
                marginLeft: "10px",
                backgroundColor: "#13131a",
              }}
            >
              <CardBody style={{ fontSize: "1.2rem", textAlign: "center" }}>
                Predicted Future Score:
              </CardBody>
            </Card>
          </div>
          <LineChart
            width={700}
            height={400}
            data={progessData}
            margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          <Card
            style={{
              border: "3px solid #1ec173",
              width: "350px",
              height: "450px",
            }}
          >
            <CardBody
              style={{
                backgroundColor: "#13131a",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              Areas you're lacking in:
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Dashboard;
