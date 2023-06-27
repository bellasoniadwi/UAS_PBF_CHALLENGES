import {Button} from "@mui/material";
// import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useRouter } from "next/router";
import axios from "axios";

const Detail = ({ product }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // const product = JSON.parse(productProps)
  return (
    <div className="col-12 md:col-12">
      <div className="card">
        <h5>Data Product</h5>
        <Accordion activeIndex={0}>
          <AccordionTab header="Nama Product">
            <p>{product.name}</p>
          </AccordionTab>
          <AccordionTab header="Harga">
            <p>Rp. {product.harga}</p>
          </AccordionTab>
          <AccordionTab header="Kategori">
            <p>{product.kategori}</p>
          </AccordionTab>
        </Accordion>
      </div>
        <Button href="/uikit/product">Back to List</Button>
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  // const snapshot = await getDocs(collection(db, 'products'));
  // const paths = snapshot.docs.map(doc => {
  //   return{
  //     params: {id: doc.id.toString()}
  //   }
  // })

  // return{
  //   paths,
  //   fallback: false
  // }
  // Fetch the list of product IDs from MySQL
  const response = await axios.get("http://localhost:8000/api/products");
  const products = response.data.data;
  const paths = products.map((product) => {
    return {
      params: { id: product.name },
    };
  });

  return {
    paths,
    fallback: true, // Set fallback to true to enable fallback behavior
  };
}

export const getStaticProps = async(context) => {
  // const id = context.params.id;

  // const docRef = doc(db, "products", id );
  // const docSnap = await getDoc(docRef);

  // return {
  //   props: {productProps: JSON.stringify(docSnap.data()) || null}
  // }
  const id = context.params.id;

  try {
    // Fetch the specific product from MySQL based on the ID
    const response = await axios.get(`http://localhost:8000/api/products/${id}`);
    const product = response.data;

    return {
      props: { product },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { product: {} }, // Provide an empty object as fallback value
    };
  }
}
 