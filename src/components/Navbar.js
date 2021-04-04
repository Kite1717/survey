import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";

import { store } from "../firebase";

function Navbar() {
  const [currentTour, setCurrentTour] = useState(null);

  const [currentShowTour, setCurrentShowTour] = useState(1);
  useEffect(() => {
    getRoundInfo();
  }, []);

  const getRoundInfo = async () => {
    const response = store.collection("currentRound");
    const data = await response.get();

    data.docs.forEach((item) => {
      setCurrentTour(item.data());
    });
  };

  const getRounds = () => {
    return (
      <tr>
        <td>
          <Button
            disabled={!checkRoundEnable(1)}
            className="px-5 mx-3"
            variant={checkRoundEnable(1) ? "info" : "secondary"}
          >
            1.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(2)}
            className="px-5  mx-3"
            variant={checkRoundEnable(2) ? "info" : "secondary"}
          >
            2.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(3)}
            className="px-5  mx-3"
            variant={checkRoundEnable(3) ? "info" : "secondary"}
          >
            3.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(4)}
            className="px-5 mx-3"
            variant={checkRoundEnable(4) ? "info" : "secondary"}
          >
            Final
          </Button>
        </td>
      </tr>
    );
  };

  const changeTourInfo = (round) => {
    if (round !== currentShowTour) {
    }
  };

  const checkRoundEnable = (round) => {
    if (currentTour) {
      return currentTour.count >= round;
    } else return false;
  };
  return (
    <Table responsive>
      <thead></thead>
      <tbody>{getRounds()}</tbody>
    </Table>
  );
}

export default Navbar;
