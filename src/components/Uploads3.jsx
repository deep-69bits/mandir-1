import React, { useState } from "react";
import AWS from "aws-sdk";
// s3://news18verse/avatars/glb/

const S3_BUCKET = "abp-metaverse-bucket";
const REGION = "us-east-1";

AWS.config.update({
  accessKeyId: "AKIA44W6IPDEEGLDEMF6",
  secretAccessKey: "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",
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

// enum contentTypeFile = {
//     image,
//     video
// }

const UploadImageToS3WithNativeSdk = ({ fileName, buttonText, type }) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      // Key: file.name,
      Key: fileName,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
        console.log(evt.loaded / evt.total);
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <div>
      {progress > 0 && <progress value={progress}></progress>}
      <input className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileInput}></input>
      {selectedFile && !(progress > 0) && (
        <button onClick={() => uploadFile(selectedFile)} className="border-black border px-10 py-2 ">
          {buttonText}
        </button>
      )}
      {progress > 0 && type == "img" && <img src={URL.createObjectURL(selectedFile)} />}
      {progress > 0 && type == "video" && <video src={URL.createObjectURL(selectedFile)} controls />}
      {progress > 0 && type == "audio" && <audio src={URL.createObjectURL(selectedFile)} controls />}
      {progress === 100 && <> Uploaded successfully</>}
    </div>
  );
};

export default UploadImageToS3WithNativeSdk;

export const uploadFileToS3 = async (file, fileName) => {
  console.log("uploading latest");
  const params = {
    ACL: "public-read",
    Body: file,
    Bucket: S3_BUCKET,
    Key: fileName,
  };
  console.log("uploading");
  await myBucket.putObject(params, (err, data) => {
    console.log(err, data);

    if (err) {
      return {
        success: false,
        err: err,
      };
    }
    return {
      success: true,
      data: data,
    };
  });
};



export const uploadJSONFileToS3 = async (file, fileName) => {
  console.log("uploading latest");
  const params = {
    ACL: "public-read",
    Body: file,
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: "application/json",
  };
  console.log("uploading");
  await myBucket.putObject(params, (err, data) => {
    console.log(err, data);

    if (err) {
      return {
        success: false,
        err: err,
      };
    }
    return {
      success: true,
      data: data,
    };
  });
};