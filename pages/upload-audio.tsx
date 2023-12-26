import type { NextPage } from "next";
import UploadImageToS3WithNativeSdk from "@/components/Uploads3";

// or only core styles
import "@splidejs/react-splide/css/core";
import { motion } from "framer-motion";
import { useState } from "react";

const HomePage: NextPage = () => {
  //   const {
  //     // register,
  //     // handleSubmit,
  //     // control,
  //     // formState:{ errors },
  //   } = useForm();
  //   const onSubmit = (data: any) => console.log(data);
  const [fileName, setFileName] = useState("");
  //   const createMatch = async () => {
  //     // get only the form name from the below form and use the keys to get the values
  //     // const player1 = getValues(["name", "scene", "team", "instagramHandle", "skills"]);
  //     const player2 = getValues(["name2", "scene2", "team2", "instagramHandle2", "skills2"]);
  //     //converring the player 1 value to json
  //     // const player1Json = await JSON.stringify(player1);
  //     //converring the player 2 value to json
  //     const player2Json = await JSON.stringify(player2);
  //     //storing it in .json file
  //     // const player1JsonFile = await new File([player1Json], "player1.json", { type: "application/json" });
  //     const player2JsonFile = await new File([player2Json], "player2.json", { type: "application/json" });
  //     //uploading the json file to s3
  //     // await uploadFileToS3(player1JsonFile, "player1.json");
  //     await uploadFileToS3(player2JsonFile, "player2.json");
  //     // console.log(player1, player2);
  //     // router.push("/match");
  //   };
  //   const playerFields1: FormField[] = [
  //     {
  //       name: "profile1Pic",
  //       label: "",
  //       errors: errors.profilePic,
  //       field: "profilePic",
  //       fileName: "profile1Pic.jpg",
  //       required: true,
  //     },
  //     {
  //       name: "name",
  //       label: "Name",
  //       errors: errors.name,
  //       field: "textField",
  //       required: true,
  //     },
  //     {
  //       name: "team",
  //       label: "Team",
  //       errors: errors.team,
  //       field: "select",
  //       onChange: () => console.log(getValues("team")),
  //       options: ["Select Team", "CSK", "RCB", "MI", "KKR", "DC", "SRH", "RR", "PBKS"],
  //       required: true,
  //     },
  //     {
  //       name: "instagramHandle",
  //       label: "IG Handle",
  //       errors: errors.instagramHandle,
  //       field: "textField",
  //       required: true,
  //     },
  //     {
  //       name: "skills",
  //       label: "Skills",
  //       errors: errors.skills,
  //       field: "textField",
  //       required: true,
  //     },
  //     {
  //       name: "player1Video",
  //       label: "Your Video",
  //       errors: errors.player1Video,
  //       field: "image",
  //       fileName: "player1Video.mp4",
  //       required: true,
  //     },
  //   ];

  //   const playerFields2: FormField[] = [
  //     {
  //       name: "winnerVideo",
  //       label: "Winner Video",
  //       errors: errors.winnerVideo,
  //       field: "image",
  //       fileName: "winnerVideo.mp4",
  //       required: true,
  //     },
  //     {
  //       name: "winnerVideo",
  //       label: "Winner Video",
  //       errors: errors.winnerVideo,
  //       field: "image",
  //       fileName: "winnerVideo1.mp4",
  //       required: true,
  //     },
  //     {
  //       name: "winnerVideo",
  //       label: "Winner Video",
  //       errors: errors.winnerVideo,
  //       field: "image",
  //       fileName: "winnerVideo2.mp4",
  //       required: true,
  //     },
  //   ];
  return (
    <div className=" bg-[#d9d0de] min-h-screen bg-hero-unsplash bg-cover text-white">
      <div className="container mx-auto">
        <div className="flex justify-center flex-col items-center gap-8  py-8">
          <h1 className="text-4xl font-bold">Audio upload</h1>
        </div>
        {/* grid layout here with forms */}
        <div className="flex">
          <div className="w-4/12">
            <input type="text" className="bg-black" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          </div>
          <div className="w-8/12">
            <UploadImageToS3WithNativeSdk fileName={fileName} buttonText={"Upload"} type="audio" />
            {/* <FormCreator fields={playerFields2} onSubmit={onSubmit} register={register} control={control} buttonText={"Create Profile"} handleSubmit={handleSubmit} showSubmitButton={false} /> */}
            {/* <FormCreator fields={playerFields1} onSubmit={onSubmit} register={register} control={control} buttonText={"Create Profile"} handleSubmit={handleSubmit} showSubmitButton={false} /> */}
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
          >
            {/* <div className="rounded-full bg-white w-56 h-56 p-4 mt-40 mx-auto">
              <Image alt="V/S" src="/assets/images/versus.png" width={200} height={200} />
            </div> */}
          </motion.div>
          <div className="w-1/12"></div>
        </div>
        <div className="w-full flex justify-center">
          {/* <button onClick={createMatch} className="bg-[#00f] border border-white text-white text-3xl font-bold py-4 px-8 rounded-lg mt-8">
            {/* Apply to Match */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
