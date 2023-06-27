import {
  Button
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";

const Detail = ({ employeeProps }) => {
  const employee = JSON.parse(employeeProps);
  return (
    <div className="col-12 md:col-12">
      <div className="card">
        <h5>Data Employee</h5>
        <Accordion activeIndex={0}>
          <AccordionTab header="Nama">
            <p>{employee.name}</p>
          </AccordionTab>
          <AccordionTab header="Email">
            <p>{employee.email}</p>
          </AccordionTab>
          <AccordionTab header="Telepon">
            <p>{employee.telepon}</p>
          </AccordionTab>
          <AccordionTab header="Jabatan">
            <p>{employee.jabatan}</p>
          </AccordionTab>
        </Accordion>
      </div>
        <Button href="/uikit/employee">Back to List</Button>
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, "employees"));
  const paths = snapshot.docs.map((doc) => {
    return {
      params: { id: doc.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;

  const docRef = doc(db, "employees", id);
  const docSnap = await getDoc(docRef);

  return {
    props: { employeeProps: JSON.stringify(docSnap.data()) || null },
  };
};
