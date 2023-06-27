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
import { TransactionContext } from "./TransactionContext";
import axios from "../../../lib/axios";

export default function TransactionForm() {
  // snackbar
  const { showAlert, transaction, setTransaction } =
    useContext(TransactionContext);
  const [id, setID] = useState(null);
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [total, setTotal] = useState("");
  const collectionRef = collection(db, "transactions");

  const getID = (id, name, product, total) => {
    setID(id)
    setName(name);
    setProduct(product);
    setTotal(total);
  }

  // button submit
  const addData = (event) => {
    event.preventDefault();

    if (transaction?.hasOwnProperty("timestamp")) {
      const docRef = doc(db, "transactions", transaction.id);
      const transactionUpdated = {
        ...transaction,
        timestamp: serverTimestamp(),
      };

      getID(transaction.id, transaction.name, transaction.product, transaction.total);
      
      updateDoc(
        docRef,
        transactionUpdated,
        setTransaction({ name: "", product: "", total: "" }),
        showAlert(
          "success",
          `Transaction with id ${docRef.id} is succesfully updated in Firebase`
        )
      ).then(() => {
        
        axios
          .put(`http://localhost:8000/api/transactions/${name}`, {
            ...transaction,

          })
          .then((response) => {
            showAlert("success", `Transaction is succesfully updated in MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Transaction can't be updated in MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Transaction can't be updated in Firebase`);
      });
    } else {
      addDoc(
        collectionRef,
        {
          ...transaction,
          timestamp: serverTimestamp(),
        },
        setTransaction({ name: "", product: "", total: "" }),
        showAlert("success", `Transaction is succesfully added to Firebase`)
      ).then(() => {
        axios
          .post("http://localhost:8000/api/transactions", {
            ...transaction,
          })
          .then((response) => {
            showAlert("success", `Transaction is succesfully added to MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Transaction can't be added to MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Transaction can't be added to Firebase`);
      });
    }
  };

  

  // detect input area
  const inputAreaRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("Outside input area");
        setTransaction({ name: "", total: "", product: "" });
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
          value={transaction.name}
          onChange={(e) =>
            setTransaction({ ...transaction, name: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Product"
          margin="normal"
          name="product"
          id="product"
          value={transaction.product}
          onChange={(e) =>
            setTransaction({ ...transaction, product: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Total"
          margin="normal"
          name="total"
          id="total"
          value={transaction.total}
          onChange={(e) =>
            setTransaction({ ...transaction, total: e.target.value })
          }
        />
        <Button
          onClick={addData}
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
        >
          {transaction.hasOwnProperty("timestamp")
            ? "Update Transaction"
            : "Add a new Transaction"}
        </Button>
      </form>
    </div>
  );
}
