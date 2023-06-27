import {
  Button
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";

const Detail = ({productProps}) => {
  const product = JSON.parse(productProps)
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
  const snapshot = await getDocs(collection(db, 'products'));
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

  const docRef = doc(db, "products", id );
  const docSnap = await getDoc(docRef);

  return {
    props: {productProps: JSON.stringify(docSnap.data()) || null}
  }
}
 