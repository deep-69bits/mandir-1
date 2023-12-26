import { useState, useEffect } from "react";
import AWS from "aws-sdk";
// import "./App.css";

AWS.config.update({
  accessKeyId: "AKIAQH2L23TJQCAQFE7O",
  secretAccessKey: "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",
});
const s3 = new AWS.S3();

const params = {
  Bucket: "ivs-liveshopping-s3bucket",
  Delimiter: "",
  Prefix: "productions/",
};

const App = () => {
  const [listFiles, setListFiles] = useState([]);

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
        Bucket: "ivs-liveshopping-s3bucket",
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
      <div className="card-header">SampleCompany Files</div>
      <button onClick={() => getImage()}>Get Image</button>
      <img id="my-img" alt="production" />
      <ul className="list-group">
        {listFiles &&
          listFiles.map((name, index) => (
            <li className="list-group-item" key={index}>
              <button onClick={() => getImage(name.Key)}>{name.Key}</button>
            </li>
          ))}
      </ul>
    </div>
  );
};


export default App;