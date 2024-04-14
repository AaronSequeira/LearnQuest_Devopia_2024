import axios from "axios";
import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Recommender = () => {
  const { state } = useLocation()
  const [ content , setContent] = useState({})
  useEffect(()=>{
    console.log(state)
    const serializedData = JSON.stringify(state);

    axios.post('http://127.0.0.1:8080/recommend', serializedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res)=>{
      console.log(res.data)
      setContent(res.data)})
    .catch((e)=>{console.log(e)})
  })


  const linksDict = {
    Fractions: [
      "https://www.youtube.com/watch?v=ke5Ik-Iq0YQ",
      "https://www.youtube.com/watch?v=akxO8eNSXJ8",
      "https://www.youtube.com/watch?v=362JVVvgYPE",
      "https://www.youtube.com/watch?v=p33BYf1NDAE",
      "https://www.youtube.com/watch?v=-sxfriO_IV0",
    ],
    Probability: [
      "https://www.youtube.com/watch?v=KzfWUEJjG18",
      "https://www.youtube.com/watch?v=SkidyDQuupA",
      "https://www.youtube.com/watch?v=94AmzeR9n2w",
      "https://www.youtube.com/watch?v=au9sxXmTM4Q",
    ],
    Statistics: [
      "https://www.youtube.com/watch?v=B1HEzNTGeZ4",
      "https://www.youtube.com/watch?v=dxLjUO8tzSA",
      "https://www.youtube.com/watch?v=kcKHFIDwBbk",
      "https://www.youtube.com/watch?v=xi8VjMmWdgI",
    ],
  };


  return (
    <>
    <h1 className="font-epilogue font-semibold font-['Ubuntu'] text-xl pb-4 md:text-4xl text-white text-center md:text-left">Recommended courses based on your performance </h1>
    <div className="container mx-auto p-6">
      {Object.entries(content).map(([topic, links]) => (
        <div key={topic} className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{topic}</h2>
          <div className="grid grid-cols-2 gap-4">
            {links.map((link) => {
              const videoId = link.split("=").pop();
              return (
                <div key={link}>
                  <iframe
                    width="200"
                    height="300"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full"
                  ></iframe>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    </>

  )
}

export default Recommender;


