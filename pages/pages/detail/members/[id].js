import {
  Button
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Accordion, AccordionTab } from "primereact/accordion";

const Detail = ({memberProps}) => {
  const member = JSON.parse(memberProps)
  return (
    <div className="col-12 md:col-12">
      <div className="card">
        <h5>Data Member</h5>
        <Accordion activeIndex={0}>
          <AccordionTab header="Nama">
            <p>{member.name}</p>
          </AccordionTab>
          <AccordionTab header="Alamat">
            <p>{member.alamat}</p>
          </AccordionTab>
          <AccordionTab header="Telepon">
            <p>{member.telepon}</p>
          </AccordionTab>
          <AccordionTab header="Usia">
            <p>{member.usia} tahun</p>
          </AccordionTab>
        </Accordion>
      </div>
        <Button href="/uikit/member">Back to List</Button>
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, 'members'));
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

  const docRef = doc(db, "members", id );
  const docSnap = await getDoc(docRef);

  return {
    props: {memberProps: JSON.stringify(docSnap.data()) || null}
  }
}
 