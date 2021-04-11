import React, { useState } from "react";
import "./App.css";
import { Container, Row } from "react-bootstrap";
import Navbar from "./components/Navbar";
import RoundInfo from "./components/RoundInfo";
import Round from "./components/Round";
import EmailValidate from "./components/EmailValidate";
import { store } from "./firebase";

function App() {
  const [suitable, setSuitable] = useState(false);
  const [user, setUser] = useState(null);

  const [startVote, setStartVote] = useState(false);

  const [roundName, setRoundName] = useState("");
  const [remainVote, setRemainVote] = useState(0);

  //Navbar
  const [isReviewRound, setIsReviewRound] = useState(false);
  const [isReviewRoundVideos, setIsReviewRoundVideos] = useState([]);

  //********** */

  const findRemainVote = async () => {
    const response = store.collection("videos");
    const data = await response.get();

    let max = 0;
    data.docs.forEach((item) => {
      if (item.data().vote > max) {
        max = item.data().vote;
      }
    });

    setRemainVote(300 - max);

    //update round Info
    getRoundInfo();
  };

  const setRoundInfo = async () => {
    const response = store.collection("currentRound");
    const data = await response.get();

    data.docs.forEach((item) => {
      setRoundName(item.data().count + 1 + ". Tur");
      response.doc("XEAGN1JpsG30ETJcZX9N").set({
        count: item.data().count + 1,
      });
    });
  };

  const getRoundInfo = async () => {
    const response = store.collection("currentRound");
    const data = await response.get();

    let reload = false;
    data.docs.forEach((item) => {
      //refresh page cause prev round problem
      if (item.data().count + ". Tur" !== roundName && roundName !== "") {
        reload = true;
      } else {
        setRoundName(item.data().count + ". Tur");
      }
    });

    return reload;
  };

  return (
    <Container fluid>
      <RoundInfo
        findRemainVote={findRemainVote}
        remainVote={remainVote}
        roundName={roundName}
      />
      <EmailValidate
        startVote={startVote}
        setStartVote={setStartVote}
        setSuitable={setSuitable}
        user={user}
        setUser={setUser}
        roundName={roundName}
      />
      <Navbar
        setIsReviewRound={setIsReviewRound}
        setIsReviewRoundVideos={setIsReviewRoundVideos}
      />
      <Row className="mt-4">
        <Round
          setStartVote={setStartVote}
          getRoundInfo={getRoundInfo}
          findRemainVote={findRemainVote}
          setSuitable={setSuitable}
          suitable={suitable}
          user={user}
          setUser={setUser}
          isReviewRound={isReviewRound}
          isReviewRoundVideos={isReviewRoundVideos}
          roundName={roundName}
        />
      </Row>
    </Container>
  );
}

export default App;
