import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { auth, store } from "../firebase";
import { Form, Button, Spinner, Container, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
function EmailValidate({
  user,
  setUser,
  setSuitable,
  startVote,
  setStartVote,
  roundName,
}) {
  const [loading, setLoading] = useState(false);

  const [showControlArea, setShowControlArea] = useState(false);

  const [email, setEmail] = useState("");

  const [final, setFinal] = useState(false);

  useEffect(() => {
    if (parseInt(roundName.split(".")[0]) === 4) {
      setUser(null);
      setStartVote(false);

      setFinal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundName]);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("user")) !== null &&
      JSON.parse(localStorage.getItem("user")) !== undefined
    ) {
      setShowControlArea(true);
      setEmail(JSON.parse(localStorage.getItem("user")).email);
    }
    const unsub = auth.onAuthStateChanged((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      if (user !== undefined && user !== null && user.emailVerified) {
        setStartVote(true);
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendUserEmailVerification = async (user, resend) => {
    user
      .sendEmailVerification()
      .then((res) => {
        Swal.fire({
          icon: "success",
          title:
            "E-posta adresinize onay maili gönderilmiştir. Lütfen kontrol ediniz.",
          footer:
            "Eğer e-postanız gelmediyse spam mailleriniz kontrol etmeyi unutmayınız.",
        });
      })
      .catch((err) => {
        if (!resend) setShowControlArea(false);
        Swal.fire({
          icon: "error",
          title:
            "Çok sık aralıklarla göndermeye çalıştınız sonra tekrar deneyiniz.",
        });
      });
  };

  const checkExistingEmail = async (email) => {
    const response = store.collection("users");
    const data = await response.get();

    let res = false;
    data.docs.forEach((item) => {
      if (item.data().email === email && item.data().voted) {
        res = true;
      }
    });

    return res;
  };

  const checkVertifyEmail = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(user.email, "123456")
      .then((res) => {
        setLoading(false);
        if (res.user.emailVerified) {
          setSuitable(true);
          setUser({ ...res.user });
          Swal.fire({
            icon: "success",
            title:
              "E-postanız onaylanmıştır.<br/> Oy kullanmaya başlayabilirsiniz.",
          });
          setStartVote(true);
        } else {
          Swal.fire({
            icon: "error",
            title:
              "E-postanız doğrulanmamıştır.<br/>E-postanızı lütfen kontrol ediniz.",
            footer:
              "Eğer e-postanız gelmediyse spam mailleriniz kontrol etmeyi unutmayınız.",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Beklenmedik bir hata oluştu tekrar deneyiniz.",
        });
      });
  };
  return (
    <>
      {!final && (
        <Container className="my-4">
          {!startVote && (
            <>
              {!showControlArea ? (
                <Formik
                  initialValues={{ email: email }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = "E posta adresiniz boş olamaz.";
                    } 
                    // else if (
                    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                    //     values.email
                    //   )
                    // ) {
                    //   errors.email =
                    //     "Lütfen geçerli bir e-posta adresi giriniz.";
                    // }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setLoading(true);
                    auth
                      .createUserWithEmailAndPassword(values.email, "123456")
                      .then((res) => {
                        //add user in firestore
                        store.collection("users").add({
                          email: values.email,
                          voted: false,
                          uid: res.user.uid,
                        });
                        //send email vertify
                        sendUserEmailVerification(res.user);
                        setSubmitting(false);
                        setLoading(false);
                        setShowControlArea(true);
                        setEmail(values.email);
                      })
                      .catch(async (err) => {
                        if (await checkExistingEmail(values.email)) {
                          // daha önceden bu email ile oy kullanılmış ise
                          Swal.fire({
                            icon: "info",
                            title: "Bu e-posta ile oy kullanılmıştır.",
                          });
                        } else {
                          Swal.fire({
                            icon: "info",
                            title: "Bu e-posta daha önceden kayıt edilmiştir.",
                            text:
                              "Tekrardan e-posta onay maili almak isterminiz?",
                            showCancelButton: true,
                            confirmButtonText: `Gönder`,
                            cancelButtonText: `İptal`,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              if (user && user.email === values.email) {
                                //send email vertify
                                sendUserEmailVerification(user);
                              } else {
                                auth
                                  .signInWithEmailAndPassword(
                                    values.email,
                                    "123456"
                                  )
                                  .then((res) => {
                                    //send email vertify
                                    sendUserEmailVerification(res.user);
                                  })
                                  .catch((err) => {
                                    Swal.fire({
                                      icon: "error",
                                      title:
                                        "Beklenmedik bir hata oluştu tekrar deneyiniz.",
                                    });
                                  });
                              }
                              setShowControlArea(true);
                              setEmail(values.email);
                            }
                          });
                        }

                        setLoading(false);
                        setSubmitting(false);
                      });
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>
                          Oy kullanmanız için e-posta adresinizi giriniz.
                        </Form.Label>
                        <Form.Control
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          name="email"
                          size="lg"
                          type="email"
                          placeholder="E-Posta"
                        />
                        <Form.Text className="text-muted">
                          E-Posta adresinize gelen onaylama mailine tıklayıp
                          onayladıktan sonra oy vermek için burada açılacak
                          butona tıklamanız gerekmektedir.
                        </Form.Text>
                        {errors.email && touched.email && errors.email && (
                          <Alert variant={"danger"}>
                            {errors.email && touched.email && errors.email}
                          </Alert>
                        )}
                      </Form.Group>
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Gönder
                        </Button>
                      )}
                    </Form>
                  )}
                </Formik>
              ) : (
                <div>
                  {user && (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Control
                          value={email}
                          name="email"
                          size="lg"
                          type="email"
                          placeholder="E-Posta"
                          disabled={true}
                        />
                      </Form.Group>
                      {loading ? (
                        <Spinner animation="border" variant="success" />
                      ) : (
                        <>
                          <Button
                            className="mr-2 mt-2"
                            variant="success"
                            type="submit"
                            onClick={checkVertifyEmail}
                          >
                            Kontrol et
                          </Button>
                          <Button
                            className="mr-2 mt-2"
                            variant="primary"
                            type="submit"
                            onClick={() =>
                              sendUserEmailVerification(user, true)
                            }
                          >
                            Tekrar Gönder
                          </Button>
                          <Button
                            className="mt-2"
                            variant="warning"
                            type="submit"
                            onClick={() => setShowControlArea(false)}
                          >
                            E-postanı değiştir
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      )}
    </>
  );
}

export default EmailValidate;
