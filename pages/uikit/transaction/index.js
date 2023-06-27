import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Transaction from "./Transaction";
import { Alert, Container, Snackbar } from "@mui/material";
import TransactionForm from "./TransactionForm";
import { TransactionContext } from "./TransactionContext";
import Grid from "@mui/material/Grid";
import axios from "../../../lib/axios";

const TransactionDemo = () => {
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState({
    name: "",
    total: "",
    product: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // useEffect(() => {
  //   const collectionRef = collection(db, "transactions");

  //   const q = query(collectionRef, orderBy("timestamp", "asc"));

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     setTransactions(
  //       querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //         timestamp: doc.data().timestamp?.toDate().getTime(),
  //       }))
  //     );
  //   });
  //   return unsubscribe;
  // }, []);

  // laravel
  // const [Datas, setDatas] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  function fetchTransactions() {
    axios
      .get("http://localhost:8000/api/transactions")
      .then((response) => {
        setTransactions(response.data.data);
        setLoading(false);
        console.log(response.data.data);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.log(error);
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid p-fluid">
      <TransactionContext.Provider
        value={{ showAlert, transaction, setTransaction }}
      >
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="card">
                <TransactionForm />
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
              {transactions.map((item, i) => (
                <Transaction
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  product={item.product}
                  total={item.total}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      </TransactionContext.Provider>
    </div>
  );
};

export default TransactionDemo;
