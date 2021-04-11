import React from "react";
import { Col } from "react-bootstrap";

function RoundReview({ isReviewRoundVideos }) {
  console.log(isReviewRoundVideos, "wqwwwwwwwww");
  return (
    <>
      {isReviewRoundVideos.map((item, i) => {
        console.log(item.data().winner, "qdzassadazcsa");
        return (
          <Col
            style={{
              padding: "0 !important",
              filter: !item.data().winner ? "grayscale(100%)" : "",
            }}
            className="text-center"
            key={i}
            xs={12}
            md={6}
            lg={3}
          >
            <div className="if-container">
              <iframe
                allowFullScreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                className="responsive-iframe"
                src={item.data().url}
              ></iframe>
            </div>
            <br />
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.6rem",
              }}
            >
              {" "}
              {item.data().vote + "  Oy  ✔️"}
            </span>
          </Col>
        );
      })}
    </>
  );
}

export default RoundReview;
