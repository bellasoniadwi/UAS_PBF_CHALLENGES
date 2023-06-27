import { IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext } from "react";
import { MemberContext } from "./MemberContext";
import { useRouter } from "next/router";
import axios from "../../../lib/axios";

const Member = ({ id, timestamp, name, alamat, telepon, usia }) => {
  const { showAlert, setMember } = useContext(MemberContext);
  // menuju detail
  const router = useRouter();

  // fungsi delete
  const deleteMember = async (id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "members", id);
    deleteDoc(
      docRef, 
      showAlert("success", `Member with id ${id} is succesfully deleted from Firebase`))
    .then(() => { 
      // Hapus data dari API Laravel
      axios
        .delete(`http://localhost:8000/api/members/${name}`)
        .then((response) => {
          // Handling sukses
          showAlert("success", `Member is successfully deleted from MySQL`);
        })
        .catch((error) => {
          // Handling error
          console.error(error);
          showAlert("error", `Member can't be deleted from MySQL`);
        });
    }).catch((error) => {
      // Handling error
      console.error(error);
      showAlert("error", `Member can't be deleted from Firebase`);
    });
  };

  //fungsi link to detail
  const seeMore = (id, e) => {
    e.stopPropagation();
    router.push(`/pages/detail/members/${id}`);
  };

  return (
    <ListItem
      onClick={() => setMember({ id, name, alamat, telepon, usia, timestamp })}
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroundColor: "#FAFAFA" }}
      secondaryAction={
        <>
          <IconButton onClick={(e) => deleteMember(id, e)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => seeMore(id, e)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText primary={name} secondary={alamat} />
    </ListItem>
  );
};

export default Member;
