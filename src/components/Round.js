import React, { useEffect, useState } from "react";
import { store } from "../firebase";
import { Button, Spinner, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import RoundReview from "./RoundReview";

import axios from "axios";
function Round({
  user,
  suitable,
  setSuitable,
  findRemainVote,
  getRoundInfo,
  setStartVote,
  isReviewRoundVideos,
  isReviewRound,
  roundName,
}) {
  console.log(roundName, "sadsadsadsa");
  useEffect(() => {
    if (user !== null && user !== undefined && user.emailVerified) {
      checkVoted(user.email);
    } else if (user === null || user === undefined) {
      setStartVote(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState([]);

  const [userRefId, setUserRefId] = useState(null);
  const getVideos = async () => {
    const response = store.collection("videos");
    const data = await response.get();

    let temp = [];
    data.docs.forEach((item) => {
      temp.push({ ...item.data(), id: item.id });
    });
    setVideos(temp);
  };
  useEffect(() => {
    getVideos();
  }, []);

  const applyVote = async (video) => {
    setLoading(true);
    let reload = await getRoundInfo();

    if (reload) {
      Swal.fire({
        icon: "info",
        title: "Bu tur bitmiştir.Bir sonraki tura yönlendiriliyorsunuz..",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        //refresh page
        localStorage.removeItem("user");
        window.location.reload();
      });
    } else {
      const videoRef = store.collection("videos").doc(video.id);
      videoRef.get().then((snapshot) => {
        let updatedVideo = snapshot.data();
        updatedVideo.vote = updatedVideo.vote + 1;
        videoRef.set(updatedVideo).then(() => {
          getVideos();
          setSuitable(false);
          //update vote
          store
            .collection("users")
            .doc(userRefId)
            .update({ voted: true })
            .then(() => {
              //refresh vote remains

              axios
                .get(
                  "https://mithat-anket-back.herokuapp.com/api/user/next-round"
                )
                .then(async () => {
                  Swal.fire({
                    icon: "info",
                    title:
                      "Bu tur bitmiştir.Bir sonraki tura yönlendiriliyorsunuz..",
                    timer: 2000,
                    showConfirmButton: false,
                  }).then(() => {
                    //refresh page
                    localStorage.removeItem("user");
                    window.location.reload();
                  });
                })
                .catch(() => {});
              findRemainVote();
              setLoading(false);
            });
        });
      });
    }
  };

  const checkVoted = async (email) => {
    store
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //set user id
          setUserRefId(doc.id);
          if (!doc.data().voted) {
            setSuitable(true);
          }
        });
      });
  };
  return (
    <>
      {!isReviewRound ? (
        <>
          {videos.map((item, i) => {
            return (
              <Col
                style={{ padding: "0 !important" }}
                className="text-center"
                key={i}
                xs={12}
                md={6}
                lg={3}
              >
                <div className="if-container">
                  <iframe
                    title="Video"
                    allowFullScreen="allowfullscreen"
                    mozallowfullscreen="mozallowfullscreen"
                    msallowfullscreen="msallowfullscreen"
                    oallowfullscreen="oallowfullscreen"
                    webkitallowfullscreen="webkitallowfullscreen"
                    className="responsive-iframe"
                    src={item.url}
                  ></iframe>
                </div>
                <br />
                {roundName !== "4. Tur" && (
                  <>
                    <span
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "1.6rem",
                      }}
                    >
                      {" "}
                      {item.vote + "  Oy  ✔️"}
                    </span>
                    <br />
                    <br />
                  </>
                )}

                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <Button
                    className="mb-3"
                    variant={!suitable ? "secondary" : "primary"}
                    type="button"
                    disabled={!suitable}
                    onClick={() => applyVote(item)}
                  >
                    Oy ver
                  </Button>
                )}
              </Col>
            );
          })}
        </>
      ) : (
        <RoundReview isReviewRoundVideos={isReviewRoundVideos} />
      )}
    </>
  );
}

export default Round;
