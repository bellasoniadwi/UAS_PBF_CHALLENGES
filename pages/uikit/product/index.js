import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Product from "./Product";
import { Alert, Container, Snackbar } from "@mui/material";
import ProductForm from "./ProductForm";
import { ProductContext } from "./ProductContext";
import Grid from "@mui/material/Grid";
import axios from "../../../lib/axios";

const ProductDemo = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: "", harga: "", kategori: "" });
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
  //   const collectionRef = collection(db, "products");

  //   const q = query(collectionRef, orderBy("timestamp", "asc"));

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     setProducts(
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
        fetchProducts()
    }, [])
    
    function fetchProducts() {
      axios
        .get("http://localhost:8000/api/products")
        .then((response) => {
          setProducts(response.data.data);
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
      <ProductContext.Provider value={{ showAlert, product, setProduct }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="card">
                <ProductForm />
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
              {products.map((item , i) => (
                <Product
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  kategori={item.kategori}
                  harga={item.harga}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      </ProductContext.Provider>
    </div>
  );
};

export default ProductDemo;
