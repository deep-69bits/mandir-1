import { useRouter } from 'next/router';
import axios from 'axios';
import {useState, useEffect} from 'react'


function YourComponent() {
    const [name, setName] = useState("");
  const router = useRouter();

  const row = router.query.row;
  const column = router.query.column;

  const spreadsheetLink = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRV2XCtUq_Och4NVzEtJyLoGkOVcYKLn7IVOD90vfIkYS25y08TPMUwSisZaEZgKoGhssmyks814J1A/pub?output=csv';
  const endpointURL = `${spreadsheetLink}?row=${row}&column=${column}`;


//   useEffect(() => {
    const getSheetData = () => {
      axios
        .get("https://docs.google.com/spreadsheets/d/e/2PACX-1vRV2XCtUq_Och4NVzEtJyLoGkOVcYKLn7IVOD90vfIkYS25y08TPMUwSisZaEZgKoGhssmyks814J1A/pub?output=csv")
        .then((response) => {
          response.data.split("\n").map((item, index) => {
            if (index > 0 && index == row ) {
              return item.split(",")[0];
              //   item.split(",")[1]
            }
          });
        })
        .catch((error) => {});
    };
    getSheetData();
//   }, []);
//   return name
}
export default YourComponent;