import React from "react";
import Countdown from "react-countdown";
import { Card } from "react-bootstrap";

function RoundInfo() {
  return (
    <div>
      <Card>
        <Card.Body className="text-center">
          <Countdown date={Date.now() + 2592000000} />
          <h1>
            1. Tur <br /> Kalan Süre : <i>00:00:00</i>
          </h1>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RoundInfo;
