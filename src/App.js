import React from "react";
import "./App.css";
import { Container,Row} from "react-bootstrap";
import Navbar from "./components/Navbar";
import RoundInfo from "./components/RoundInfo";
import Round from "./components/Round";
function App() {

  return (
    <Container fluid>
      <RoundInfo />
      <Navbar />
      <Row>
        <Round/>
      </Row>
    </Container>
  );
}

export default App;
