import { Button, TextField } from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc
} from "@firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { MemberContext } from "./MemberContext";
import axios from "../../../lib/axios";

export default function MemberForm() {
  // snackbar
  const { showAlert, member, setMember } = useContext(MemberContext);
  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [usia, setUsia] = useState('');
  const collectionRef = collection(db, "members");

  const getID = (id, name, alamat, telepon, usia) => {
    setID(id)
    setName(name);
    setAlamat(alamat);
    setTelepon(telepon);
    setUsia(usia);
  }

  // button submit
  const addData = (event) => {
    event.preventDefault();

    if (member?.hasOwnProperty("timestamp")) {
      const docRef = doc(db, "members", member.id);
      const memberUpdated = { ...member, timestamp: serverTimestamp() };

      getID(member.id, member.name, member.alamat, member.telepon, member.usia);

      updateDoc(
        docRef,
        memberUpdated,
        setMember({ name: "", alamat: "", telepon: "", usia: "" }),
        showAlert(
          "success",
          `Member with id ${docRef.id} is succesfully updated in Firebase`
        )
      ).then(() => {
        
        axios
          .put(`http://localhost:8000/api/members/${name}`, {
            ...member

          })
          .then((response) => {
            showAlert("success", `Member is succesfully updated in MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Member can't be updated in MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Member can't be updated in Firebase`);
      });
    } else {
      addDoc(
        collectionRef,
        {
          ...member,
          timestamp: serverTimestamp(),
        },
        setMember({ name: "", alamat: "", usia: "", telepon: "" }),
        showAlert("success", `Member is succesfully added to Firebase`)
      ).then(() => {
        axios
          .post("http://localhost:8000/api/members", {
            ...member,
          })
          .then((response) => {
            showAlert("success", `Member is succesfully added to MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Member can't be added to MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Member can't be added to Firebase`);
      });
    }
  };

  

  // detect input area
  const inputAreaRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("Outside input area");
        setMember({ name: "", alamat: "", usia: "", telepon: "" });
      } else {
        console.log("Inside input area");
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  return (
    <div ref={inputAreaRef}>
      <form method="POST" onSubmit={addData}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          name="name"
          id="name"
          value={member.name}
          onChange={(e) => setMember({ ...member, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Alamat"
          margin="normal"
          name="alamat"
          id="alamat"
          value={member.alamat}
          onChange={(e) => setMember({ ...member, alamat: e.target.value })}
        />
        <TextField
          fullWidth
          label="Telepon"
          margin="normal"
          name="telepon"
          id="telepon"
          value={member.telepon}
          onChange={(e) => 
            setMember({ ...member, telepon: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Usia"
          margin="normal"
          name="usia"
          id="usia"
          value={member.usia}
          onChange={(e) => 
            setMember({ ...member, usia: e.target.value })
          }
        />
        <Button 
          onClick={addData} 
          type="submit" 
          variant="contained" 
          sx={{ mt: 3 }}
        >
          {member.hasOwnProperty("timestamp")
            ? "Update Member"
            : "Add a new Member"}
        </Button>
      </form>
    </div>
  );
}
