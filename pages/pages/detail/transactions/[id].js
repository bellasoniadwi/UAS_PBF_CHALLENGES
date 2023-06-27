import {
  Button
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";

const Detail = ({transactionProps}) => {
  const transaction = JSON.parse(transactionProps)
  return (
    <div className="col-12 md:col-12">
      <div className="card">
        <h5>Data Transaction</h5>
        <Accordion activeIndex={0}>
          <AccordionTab header="Nama">
            <p>{transaction.name}</p>
          </AccordionTab>
          <AccordionTab header="Barang yang Dipinjam">
            <p>{transaction.product}</p>
          </AccordionTab>
          <AccordionTab header="Total Harga">
            <p>Rp. {transaction.total}</p>
          </AccordionTab>
        </Accordion>
      </div>
        <Button href="/uikit/transaction">Back to List</Button>
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, 'transactions'));
  const paths = snapshot.docs.map(doc => {
    return{
      params: {id: doc.id.toString()}
    }
  })

  return{
    paths,
    fallback: false
  }
}

export const getStaticProps = async(context) => {
  const id = context.params.id;

  const docRef = doc(db, "transactions", id );
  const docSnap = await getDoc(docRef);

  return {
    props: {transactionProps: JSON.stringify(docSnap.data()) || null}
  }
}
 