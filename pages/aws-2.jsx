import { useState, useEffect } from "react";
import AWS from "aws-sdk";
// import "./App.css";

AWS.config.update({
  accessKeyId: "AKIA5VBJLFVQIDUVSTMF",
  secretAccessKey: "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",
});
const s3 = new AWS.S3();

const params = {
  Bucket: "news18-ar-filter",
  Delimiter: "",
//   Prefix: "content/",
};

const App = () => {
  const [listFiles, setListFiles] = useState([]);
const [paginate, setPaginate] = useState(0);
  useEffect(() => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        setListFiles(data.Contents);
        console.log(data.Contents);
      }
    });
  }, []);

  const getImage = async (imageKey) => {
    s3.getObject(
      {
        Bucket: "mp-bucket-aws",
        Key: imageKey,
      },
      (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(data);
          document.getElementById("my-img").src = URL.createObjectURL(new Blob([data.Body.buffer], { type: "image/png" } /* (1) */));
        }
      }
    );
  };

  return (
    <div className="card">
      <div className="fixed top-0 right-0">{paginate}</div>
      <button className="fixed bottom-8 right-4 p-8 text-center w-[280px] h-[480px]" onClick={() => setPaginate((paginate) => paginate + 1)}>
        Next
      </button>
      <button className="fixed bottom-8 left-4 p-8 text-center w-[280px] h-[480px]" onClick={() => setPaginate((paginate) => paginate - 1)}>
        prev
      </button>
      <div className="card-header">SampleCompany Files</div>
      <button onClick={() => getImage()}>Get Image</button>
      <img id="my-img" alt="production" />
      <ul
        className="list-group w-full flex justify-center items-center flex-col gap-8
      "
      >
        {listFiles &&
          listFiles.map((name, index) => (
            <>
              {index == paginate && (
                <li className="list-group-item mx-auto border border-red-600 rounded-xl bg-red-600 text-white" key={index}>
                  {/* <button onClick={() => getImage(name.Key)}>{name.Key}</button> */}

                  <video autoPlay src={"https://news18-ar-filter.s3.amazonaws.com/" + name.Key} controls></video>
                  <h1 className="text-2xl ">{name.Key.split("_")[0]}</h1>
                  <h1>{name.Key.split("_")[1]}</h1>
                  {/* <h1>{(name.Key.split("_")[2] * 1000).toLocaleString()}</h1> */}
                </li>
              )}
            </>
          ))}
      </ul>
    </div>
  );
};


export default App;