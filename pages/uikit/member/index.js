import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Member from "./member";
import { Alert, Container, Snackbar } from "@mui/material";
import MemberForm from "./MemberForm";
import { MemberContext } from "./MemberContext";
import Grid from "@mui/material/Grid";
import axios from "../../../lib/axios";

const MemberDemo = () => {
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState({
    name: "",
    alamat: "",
    usia: "",
    telepon: "",
  });

  // snackbar
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // create - firebase
  useEffect(() => {
    const collectionRef = collection(db, "members");

    const q = query(collectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMembers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  // laravel
  const [Datas, setDatas] = useState([])

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/members")
            .then(function (response) {
                setDatas(response.data.data)
                console.log(Datas)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [Datas])
    console.log('Data:', Datas)

  return (
    <div className="grid p-fluid">
      <MemberContext.Provider value={{ showAlert, member, setMember }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="card">
                <MemberForm />
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={alertType}
                    sx={{ width: "100%" }}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
              </div>
            </Grid>
            <Grid item xs={6}>
              {members.map((members) => (
                <Member
                  key={members.id}
                  id={members.id}
                  name={members.name}
                  alamat={members.alamat}
                  usia={members.usia}
                  telepon={members.telepon}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      </MemberContext.Provider>
    </div>
  );
};

export default MemberDemo;
