import type { NextPage } from "next";
import UploadImageToS3WithNativeSdk, { uploadFileToS3, uploadJSONFileToS3 } from "@/components/Uploads3";

// or only core styles
import "@splidejs/react-splide/css/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Spreadsheet from "react-spreadsheet";


const uploadList = [
  {
    awsFileKey: "content/poll.png",
    displayName: "Poll Question (.png file only)",
    type: "img",
  },
  {
    awsFileKey: "content/video1.mp4",
    displayName: "News Studio Video (.mp4)",
    type: "video",
  },

  {
    awsFileKey: "content/audio1.mp3",
    displayName: "News Audio file (.mp3)",
    type: "audio",
  },
];

const HomePage: NextPage = () => {
  const [fileName, setFileName] = useState("");
  const [initialData, setInitialData] = useState<any>();
  const [finalData, setFinalData] = useState<any>();


  useEffect(() => {
    function getData() {
      axios.get("https://abp-metaverse-bucket.s3.amazonaws.com/content.json").then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const transformedData = response.data.map((item: any) => [{ value: item.type }, { value: item.link }, { value: item.comment }]);
        setInitialData(transformedData);
      });
      // setInitialData(JSON.parse(response.data, null, 2));
    }
    getData();
  }, []);


const addRow = () => {
  // Create a new empty row
  const newRow = [{ value: "" }, { value: "" }, { value: "" }];

  // Update the state with the new row appended
  setInitialData((prevData:any) => [...prevData, newRow]);
};


  function reverseTransform(data:any) {
    return data.map((row:any) => ({
      type: row[0].value,
      link: row[1].value,
      comment: row[2].value,
    }));
  }

  function onChange(data:any) {
    console.log(data);

    // Reverse the transformation and update the original data
    const originalData = reverseTransform(data);
    // Now 'originalData' holds the updated structure in your desired format
    console.log(originalData);
    setFinalData(() => originalData);

    // Perform any actions needed with the updated data
    // For example, you might want to send it to your server or update state
  }

  async function updateJSON() {
    // here we're just uploading to s3
    // finalData is the variable which holds the json data to be uploaded to s3
    // toast.loading("Updating content data")
    await uploadJSONFileToS3(
      JSON.stringify(finalData), //file is the first parameter
      "content.json"
    );
    // toast.loading
    toast.success("updated");
  }
  return (
    <div className=" bg-[#d9d0de] min-h-screen bg-hero-unsplash bg-cover text-white">
      <ToastContainer />
      <div className="container mx-auto">
        <div className="flex justify-center flex-col items-center gap-8  py-8">
          <h1 className="text-4xl font-bold">Content Panel</h1>
        </div>
        {/* <a className="w-full relative block z-20" style={{ width: "100%", height: "500px" }} href="https://docs.google.com/spreadsheets/d/1MXxy8EAg6OeGWwkcrZTP4fOAWMQTVLyTfCcbHaQ-8qI/edit?usp=sharing"></a>
        <iframe
          style={{ width: "100%", height: "500px", marginTop: "-500px", position: "relative" }}
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRV2XCtUq_Och4NVzEtJyLoGkOVcYKLn7IVOD90vfIkYS25y08TPMUwSisZaEZgKoGhssmyks814J1A/pubhtml?widget=true&amp;headers=false"
        ></iframe> */}
        {/* json editor goes here */}

        {/* end json editor */}
        {initialData && (
          <>
            {/* console.log(initialData) */}
            <Spreadsheet className="w-full overflow-hidden " data={initialData} onChange={(data) => onChange(data)} columnLabels={["type", "url", "comment"]} />
          </>
        )}
        <br />
        <div className="flex justify-center gap-8 py-2 items-center">
          <button className="bg-white text-red-600 border-red-600" onClick={addRow}>Add new row</button>
          <button onClick={updateJSON}>Update Excel Data</button>

        </div>
        <br />
        <br />
        <br />
        <br />

        {uploadList.map((data, index) => (
          <div className="flex" key={index}>
            <div className="w-4/12 text-black">
              <h2>{data.displayName}</h2>
              <input type="text" className="bg-black hidden" value={data.awsFileKey} disabled />
            </div>
            <div className="w-6/12">
              <UploadImageToS3WithNativeSdk fileName={data.awsFileKey} buttonText={"Upload"} type={data.type} />
            </div>
            <div className="w-6/12">
              {data.type == "img" && <img src={"https://abp-metaverse-bucket.s3.amazonaws.com/" + data.awsFileKey} />}
              {data.type == "video" && <video src={"https://abp-metaverse-bucket.s3.amazonaws.com/" + data.awsFileKey} controls />}
              {data.type == "audio" && <audio src={"https://abp-metaverse-bucket.s3.amazonaws.com/" + data.awsFileKey} controls />}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                duration: 2,
                damping: 20,
              }}
              className="w-2/12"
            ></motion.div>
            <div className="w-1/12"></div>
          </div>
        ))}
        <div className="w-full flex justify-center"></div>
      </div>
    </div>
  );
};

export default HomePage;
