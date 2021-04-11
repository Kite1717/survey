import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";

import { store } from "../firebase";

function Navbar({ setIsReviewRound, setIsReviewRoundVideos }) {
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
            onClick={() => getRoundVideos(1)}
          >
            1.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(2)}
            className="px-5  mx-3"
            variant={checkRoundEnable(2) ? "info" : "secondary"}
            onClick={() => getRoundVideos(2)}
          >
            2.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(3)}
            className="px-5  mx-3"
            variant={checkRoundEnable(3) ? "info" : "secondary"}
            onClick={() => getRoundVideos(3)}
          >
            3.Tur
          </Button>
        </td>
        <td>
          <Button
            disabled={!checkRoundEnable(4)}
            className="px-5 mx-3"
            variant={checkRoundEnable(4) ? "info" : "secondary"}
            onClick={() => getRoundVideos(4)}
          >
            Final
          </Button>
        </td>
      </tr>
    );
  };

  const getRoundVideos = async (round) => {
    if (currentTour.count !== round) {
      const response = store
        .collection(`reviewRound${round}`)
        .orderBy("vote", "desc");
      const data = await response.get();

      setIsReviewRoundVideos(data.docs);
      setIsReviewRound(true);
    } else {
      setIsReviewRound(false);
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
