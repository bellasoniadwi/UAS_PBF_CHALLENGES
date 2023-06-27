import {
  Button
} from "@mui/material";
// import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useRouter } from "next/router";
import axios from "axios";

const Detail = ({transaction}) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // const transaction = JSON.parse(transactionProps)
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
  // const snapshot = await getDocs(collection(db, 'transactions'));
  // const paths = snapshot.docs.map(doc => {
  //   return{
  //     params: {id: doc.id.toString()}
  //   }
  // })

  // return{
  //   paths,
  //   fallback: false
  // }
  const response = await axios.get("http://localhost:8000/api/transactions");
  const transactions = response.data.data;
  const paths = transactions.map((transaction) => {
    return {
      params: { id: transaction.name },
    };
  });

  return {
    paths,
    fallback: true, // Set fallback to true to enable fallback behavior
  };
}

export const getStaticProps = async(context) => {
  // const id = context.params.id;

  // const docRef = doc(db, "transactions", id );
  // const docSnap = await getDoc(docRef);

  // return {
  //   props: {transactionProps: JSON.stringify(docSnap.data()) || null}
  // }
  const id = context.params.id;

  try {
    // Fetch the specific product from MySQL based on the ID
    const response = await axios.get(`http://localhost:8000/api/transactions/${id}`);
    const transaction = response.data;

    return {
      props: { transaction },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { transaction: {} }, // Provide an empty object as fallback value
    };
  }
}
 