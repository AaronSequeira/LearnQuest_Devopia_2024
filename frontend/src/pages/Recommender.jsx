import axios from "axios";
import { React, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Recommender = () => {
  const { state } = useLocation()
  useEffect(()=>{
    console.log(state)
    const serializedData = JSON.stringify(state);

axios.post('http://127.0.0.1:8080/recommend', serializedData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
    .then((res)=>{console.log(res.data)})
    .catch((e)=>{console.log(e)})
  })
  return (
    <div>
      <div className="aspect-video">
        <iframe src="https://www.youtube.com/embed/0nr6TPKlrN0" title="Youtube Videos" width={500} height={300} allowFullScreen></iframe>
      </div>
    </div>
  )
}

export default Recommender;


