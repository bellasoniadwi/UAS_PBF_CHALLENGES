import { IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext } from "react";
import { ProductContext } from "./ProductContext";
import { useRouter } from "next/router";
import axios from "../../../lib/axios";

const Product = ({ id, timestamp, name, harga, kategori }) => {
  const { showAlert, setProduct } = useContext(ProductContext);

  // menuju detail
  const router = useRouter();

  //fungsi link to detail
  const seeMore = (id, e) => {
    e.stopPropagation();
    router.push(`/pages/detail/products/${id}`);
  };

  // fungsi delete
  const deleteProduct = async (id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "products", id);
    deleteDoc(docRef, 
      showAlert("success", `Product with id ${id} is succesfully deleted from Firebase`))
      .then(() => {
      // Hapus data dari API Laravel
      axios
        .delete(`http://localhost:8000/api/products/${name}`)
        .then((response) => {
          // Handling sukses
          showAlert("success", `Product is successfully deleted from MySQL`);
        })
        .catch((error) => {
          // Handling error
          console.error(error);
          showAlert("error", `Product can't be deleted from MySQL`);
        });
      }).catch((error) => {
        // Handling error
        console.error(error);
        showAlert("error", `Product can't be deleted from Firebase`);
    });
  };

  return (
    <ListItem
      onClick={() => setProduct({ id, name, harga, kategori, timestamp })}
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroundColor: "#FAFAFA" }}
      secondaryAction={
        <>
          <IconButton onClick={(e) => deleteProduct(id, e)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => seeMore(id, e)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText primary={name} secondary={harga} />
    </ListItem>
  );
};

export default Product;
