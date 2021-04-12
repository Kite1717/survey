import React, { useEffect } from "react";
import { Card } from "react-bootstrap";

function RoundInfo({ findRemainVote, remainVote, roundName }) {
  //get max remains 300 vote and update round Info
  useEffect(() => {
    findRemainVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card bg={"dark"} text={"light"}>
        <Card.Body className="text-center">
          <h1 style={{ 
            fontFamily: "New Tegomin, serif" 
            }}>
            {parseInt(roundName.split(".")[0]) === 4 ? "Final" : `${roundName}`}{" "}
            <br />
            <i className="d-flex justify-content-center align-items-center">
              {parseInt(roundName.split(".")[0]) !== 4 ? (
                <>
                  {roundName !== "" && (
                    <span>
                      {" "}
                      {parseInt(roundName.split(".")[0]) + 1 < 4
                        ? `${parseInt(roundName.split(".")[0]) + 1} . Tur’a `
                        : "Final Turuna "}{" "}
                      Geçilmesi İçin 1 Kişinin Alacağı 300 Oy’dan Kalan Oy
                      Sayısı :{remainVote}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span>Oylama bitmiştir.</span>
                </>
              )}
            </i>
          </h1>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RoundInfo;
