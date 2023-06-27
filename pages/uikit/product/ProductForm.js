import { Button, TextField } from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "@firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { ProductContext } from "./ProductContext";
import axios from "../../../lib/axios";

export default function ProductForm() {
  // snackbar
  const { showAlert, product, setProduct } = useContext(ProductContext);
  const [id, setID] = useState(null);
  const [name, setName] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("");

  const collectionRef = collection(db, "products");

  const getID = (id, name, harga, kategori) => {
    setID(id);
    setName(name);
    setHarga(harga);
    setKategori(kategori);

  };

  // button submit
  const addData = (event) => {
    event.preventDefault();

    if (product?.hasOwnProperty("timestamp")) {
      const docRef = doc(db, "products", product.id);
      const productUpdated = { ...product, timestamp: serverTimestamp() };

      getID(product.id, product.name, product.harga, product.kategori);

      updateDoc(
        docRef,
        productUpdated,
        setProduct({ name: "", harga: "", kategori: "" }),
        showAlert(
          "success",
          `Product with id ${docRef.id} is succesfully updated in Firebase`
        )
      ).then(() => {

        axios
          .put(`http://localhost:8000/api/products/${name}`, {
            ...product
            
          })
          .then((response) => {
            showAlert("success", `Product is succesfully updated in MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Product can't be updated in MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Product can't be updated in Firebase`);
      });
    } else {
      addDoc(
        collectionRef,
        {
          ...product,
          timestamp: serverTimestamp(),
        },
        setProduct({ name: "", harga: "", kategori: "" }),
        showAlert("success", `Product is succesfully added to Firebase`)
      ).then(() => {
        axios
          .post("http://localhost:8000/api/products", {
            ...product,
          })
          .then((response) => {
            showAlert("success", `Product is succesfully added to MySQL`);
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", `Product can't be added to MySQL`);
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", `Product can't be added to Firebase`);
      });
    }
  };

  // detect input area
  const inputAreaRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("Outside input area");
        setProduct({ name: "", harga: "", kategori: "" });
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
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Harga"
          margin="normal"
          name="harga"
          id="harga"
          value={product.harga}
          onChange={(e) => setProduct({ ...product, harga: e.target.value })}
        />
        <TextField
          fullWidth
          label="Kategori"
          margin="normal"
          name="kategori"
          id="kategori"
          value={product.kategori}
          onChange={(e) => setProduct({ ...product, kategori: e.target.value })}
        />
        <Button
          onClick={addData}
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
        >
          {product.hasOwnProperty("timestamp")
            ? "Update Product"
            : "Add a new Product"}
        </Button>
      </form>
    </div>
  );
}
