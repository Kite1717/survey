import React, { useState,useEffect } from "react";
import Countdown from "react-countdown";
import { Card } from "react-bootstrap";
import { store } from "../firebase";

const Completionist = () => (
  <span>Süre Bitti bir sonraki tura geçiliyor...</span>
);

function RoundInfo() {

  const getRoundInfo =  async() =>{

    const response=store.collection('currentRound');
    const data=await response.get();

    data.docs.forEach(item=>{
      setRoundName(item.data().count + ". Tur")
    })

  }

  const setRoundInfo = async ()=>{

    const response=store.collection('currentRound');
    const data=await response.get();

    data.docs.forEach(item=>{
      setRoundName(item.data().count+1 + ". Tur")
      response.doc("XEAGN1JpsG30ETJcZX9N").set({
        count: item.data().count+1
      });
    })
  }

  useEffect( ()=>{

    getRoundInfo()
    
  },[])


  const [roundName,setRoundName] = useState("")
  const [days30, setDays30] = useState(Date.now() + 2592);
  const [keyCounter, setKeyCounter] = useState(1);

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setKeyCounter(keyCounter + 1);
      setDays30(Date.now() + 2592000000);

      setRoundInfo()
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <h1>
           {roundName} <br /> Kalan Süre :{" "}
          <i>
            {(days < 10 ? "0" : "") + days}:{(hours < 10 ? "0" : "") + hours}:
            {(minutes < 10 ? "0" : "") + minutes}:
            {(seconds < 10 ? "0" : "") + seconds}
          </i>
        </h1>
      );
    }
  };
  return (
    <div>
      <Card bg={"dark"} text={"light"}>
        <Card.Body className="text-center">
          <Countdown
            key={keyCounter}
            autoStart={true}
            date={days30}
            renderer={renderer}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default RoundInfo;
