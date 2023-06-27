import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Employee from "./Employee";
import { Alert, Container, Snackbar } from "@mui/material";
import EmployeeForm from "./EmployeeForm";
import { EmployeeContext } from "./EmployeeContext";
import Grid from "@mui/material/Grid";
import axios from "../../../lib/axios";

const EmployeeDemo = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    telepon: "",
    jabatan: "",
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
    const collectionRef = collection(db, "employees");

    const q = query(collectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setEmployees(
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
            .get("http://localhost:8000/api/employees")
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
    <EmployeeContext.Provider value={{ showAlert, employee, setEmployee }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
          <div className="card">
            <EmployeeForm />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
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
            {employees.map((employee) => (
              <Employee
                key={employee.id}
                id={employee.id}
                name={employee.name}
                email={employee.email}
                jabatan={employee.jabatan}
                telepon={employee.telepon}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </EmployeeContext.Provider>
    </div>
  );
};

export default EmployeeDemo;
