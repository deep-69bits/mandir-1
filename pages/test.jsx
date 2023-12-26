import { useState, useEffect } from "react";
import AWS from "aws-sdk";


AWS.config.update({
  accessKeyId: "AKIAQH2L23TJQCAQFE7O",
  secretAccessKey: "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",
});


const s3 = new AWS.S3();

const parameters = {
  Bucket: "mp-bucket-aws",
  Prefix: "content/",
};

const FileListing = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log("mounted")
    s3.listObjectsV2(parameters, (error, data) => {
        console.log("data")
      if (error) {
        console.error(error, error.stack);
      } else {
        console.log(data.Contents[1])
        setFiles([data.Contents[1]]);
      }
    });
  }, []);

  const uploadFile = (event, key) => {
    console.log("in upload");
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadParameters = {
        Bucket: "mp-bucket-aws",
        Key: key,
        Body: e.target.result,
      };
      s3.upload(uploadParameters, (error, data) => {
        if (error) {
          console.error(error, error.stack);
        } else {
          console.log("Image uploaded successfully", data);
        }
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const refreshFiles = () => {
    s3.listObjectsV2(parameters, (error, data) => {
      if (error) {
        console.error(error, error.stack);
      } else {
        console.log(data.Contents)
        setFiles(data.Contents);
      }
    });
  };

  return (
    <div className="card">
      <div className="card-header">Content Panel</div>
      {files.map((file) => (
        <div key={file.Key} className="flex m-2">
          (console.log(file) && file && file.Body && file.Body.buffer && <img src={URL.createObjectURL(new Blob([file.Body.buffer], { type: "image/png" }))} alt="Image" className="w-1/2" />)
          <input type="file" onChange={(e) => uploadFile(e, file.Key)} className="w-1/2" />
        </div>
      ))}
      <button onClick={refreshFiles}>Update Images</button>
    </div>
  );
};

export default FileListing;