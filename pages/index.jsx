import { useState, useEffect } from "react";
import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import AvatarIframe from "@/components/AvatarIframe";
import styles from "@/styles/App.module.css";
import AWS from "aws-sdk";
import Image from "next/image";
import { allAvatarModels, femaleAvatarModels } from "@/constants/avatarImgs";
import { UserIcon } from "@heroicons/react/20/solid";

const S3_BUCKET = "abp-metaverse-bucket";
const REGION = "us-east-1";


const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});



const maleAnimations = {
  //   Anger: "./animations/male/Anger.glb",
  //   Clap: "./animations/male/Clap.glb",
  //   Fear: "./animations/male/Fear.glb",
  //   Fly: "./animations/male/Fly.glb",
  //   HandRaised: "./animations/male/HandRaised.glb",
  Idle: "./animations/male/Idle.glb",
  //   Laugh: "./animations/male/Laugh.glb",
  //   Run: "./animations/male/Run.glb",
  //   RunBack: "./animations/male/RunBack.glb",
  //   RunLeft: "./animations/male/RunLeft.glb",
  //   RunRight: "./animations/male/RunRight.glb",
  //   SitEnd: "./animations/male/SitEnd.glb",
  //   SitStart: "./animations/male/SitStart.glb",
  //   Sitting: "./animations/male/Sitting.glb",
  Walk: "./animations/male/Walk.glb",
  //   Dancing: "./animations/male/Dancing.glb",
  WalkBack: "./animations/male/WalkBack.glb",
  WalkLeft: "./animations/male/WalkLeft.glb",
  WalkRight: "./animations/male/WalkRight.glb",
  //   Wave: "./animations/male/Wave.glb",
};

const femaleAnimations = {
  //   Anger: "./animations/female/Anger.glb",
  //   Clap: "./animations/female/Clap.glb",
  //   Fear: "./animations/female/Fear.glb",
  //   Fly: "./animations/female/Fly.glb",
  //   HandRaised: "./animations/female/HandRaised.glb",
  Idle: "./animations/female/IdleFemale.glb",
  //   Laugh: "./animations/female/Laugh.glb",
  //   Run: "./animations/female/Run.glb",
  //   RunBack: "./animations/female/RunBack.glb",
  //   RunLeft: "./animations/female/RunLeft.glb",
  //   RunRight: "./animations/female/RunRight.glb",
  //   SitEnd: "./animations/female/SitEnd.glb",
  //   SitStart: "./animations/female/SitStart.glb",
  //   Sitting: "./animations/female/Sitting.glb",
  Walk: "./animations/female/WalkFemale.glb",
  //   Dancing: "./animations/female/Dancing.glb",
  WalkBack: "./animations/female/WalkBackFemale.glb",
  WalkLeft: "./animations/female/WalkLeftFemale.glb",
  WalkRight: "./animations/female/WalkRightFemale.glb",
  //   Wave: "./animations/female/Wave.glb",
};

const gltfName = "Armature";
export default function GlbCombiner() {
  const [isFromFile, setIsFromFile] = useState(true);
  const [isMale, setIsMale] = useState(undefined);
  const [steps, setSteps] = useState(0);
  const [modelName, setfirstName] = useState(null);
  const [username, setUsername] = useState(undefined);
  const [warning, setWarning] = useState(null);
  //   const [avatarUrl, setAvatarUrl] = useState("https://models.readyplayer.me/6538eafd0935b38c908a5cda.glb?morphTargets=none&quality=high");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isFrameOpen, setIsFrameOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isSafari, setSafari] = useState(false);

  const [flight,setflight]=useState('null')
  const [state,setState]=useState('')

  useEffect(() => {
    const checkBrowser = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/safari/.test(userAgent)) {
        if (!/chrome/.test(userAgent)) {
          setSafari(true);
        }
      }
    }
    checkBrowser();
  }, []);


  function avatarUrlSplitter(avatarUrl) {
    const splitUrl = avatarUrl.split("https://models.readyplayer.me/")[1].split(".glb")[0];
    console.log(splitUrl);
    return splitUrl;
    // return "6538eafd0935b38c908a5cda";
  }

  async function combineAndLoadAnimation(avatarUrl) {
    console.log(avatarUrl);
    handleNext();
    const combinedGlbFile = await combineAnimations(avatarUrl, setFile).catch(console.error);
    console.log("combine animations completed and data is", combinedGlbFile);
    // download(avatarUrl.split(".glb")[0].split("/")[avatarUrl.split(".glb")[0].split("/").length - 1] + ".glb", data);
    // instead of download we'll take them to the url while uploading to s3
    // uploadFileToS3(data, "username.glb");
    // console.log()
    // const filed = new File([combinedGlbFile], avatarUrlSplitter(avatarUrl) + ".glb", {
    //   type: "model/gltf-binary",
    // });
    // uploadToprogress(combinedGlbFile, avatarUrlSplitter(avatarUrl), setFile, setProgress);
    uploadFileToS3(combinedGlbFile, avatarUrlSplitter(avatarUrl), setProgress);
  }

  //   async function handleSubmit() {
  //     console.log("handle submit");
  //   }

  //   function uploadToprogress(arrayBuffer, fileName, setFile, setProgress) {
  //     //   const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
  //     //   setFile(blob);
  //     uploadFileToS3(arrayBuffer, fileName, setProgress);

  //     console.log(fileName);

  //     // const url = URL.createObjectURL(blob);

  //     // const a = document.createElement("a");
  //     // a.href = url;
  //     // console.log(a);
  //     // a.download = "test.glb";
  //     // a.click();
  //   }

  const uploadFileToS3 = async (file, fileName, setProgress) => {
    console.log(fileName);
    console.log(file);
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: "avatars/glb/" + fileName + ".glb",
    };

    await myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log("uploaded 100%");
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });

    // here is something on how to do
    // https://events.news18verse.com/?avatarUrl=hrithikwins&name=3dvideo
  };
  //   function download(filename, data) {
  //     var element = document.createElement("a");
  //     element.href = data;
  //     element.setAttribute("download", filename);

  //     element.style.display = "none";
  //     document.body.appendChild(element);

  //     element.click();

  //     document.body.removeChild(element);
  //   }

  //   async function onAnimationUpload(e) {
  //     setModelName(e.target.files);
  //     setFile;
  //   }
  async function combineAnimations(modelPathName, setFile) {
    const gltfLoader = new GLTFLoader();
    const gltfExporter = new GLTFExporter();
    const group = new Group();

    group.name = gltfName;

    const gltf = await loadGltfFiles(gltfLoader, modelPathName);
    group.add(gltf.scene);

    await loadAnimations(group, isMale ? maleAnimations : femaleAnimations);
    const glbFile = await exportedAnimations(gltfExporter, gltf, group);
    return glbFile;
  }

  async function exportedAnimations(gltfExporter, gltf, group) {
    return new Promise((resolve, reject) => {
      gltfExporter.parse(
        gltf.scene,
        (glb) => {
          //   const blob = new Blob([glb], { type: "application/octet-stream" });
          resolve(glb);
        },
        console.error,
        { binary: true, animations: group.animations }
      );
    });
  }

  async function loadAnimations(group, animations) {
    const gltfLoader = new GLTFLoader();
    for (const [name, path] of Object.entries(animations)) {
      const gltf = await loadGltfFiles(gltfLoader, path);
      gltf.animations[0].name = name;
      group.animations.push(gltf.animations[0]);
    }
  }

  async function loadGltfFiles(gltfLoader, path) {
    return await new Promise((resolve, reject) => {
      gltfLoader.load(path, resolve, undefined, reject);
    });
  }

  function handleNext() {
    setSteps(steps + 1);
  }

  function takeToTheMetaverse() {
    if (avatarUrl) {
      // window.open("https://metaverse-elections.netlify.app?avatarUrl=" + avatarUrlSplitter(avatarUrl) + "&name=" + username + "&gender=" + (isMale ? "male" : "female"));
      window.open("https://elections.abpverse.com" + "/?avatarUrl=" + avatarUrlSplitter(avatarUrl) + "&name=" + username + (isSafari ? "&browser=safari" : ""));
    }
  }

  useEffect(() => {
    if (avatarUrl != "" && username && username.length > 3 && progress == 100) {
      takeToTheMetaverse();
    }
  }, [avatarUrl]);

  return (
    <>

      <div className={`bg-hero-bg  max-w-8xl md:bg-hero-bg bg-cover bg-no-repeat mx-auto flex flex-row items-center  md:p-0 p-4 justify-center  md:m-0  h-[100vh] md:w-[100vw] `}>
      <img src="/assets/images/Line.png" className="absolute  top-[-370px]  rotate-90 w-[50px] " alt="" />

      <img src="/assets/images/flower-left.png" className="absolute left-14 top-0" alt="" />
      <img src="/assets/images/flower-right.png" className="absolute right-14 top-0" alt="" />
      <img src="/assets/images/Line.png" className="absolute right-4 top-20 h-4/5  w-[50px] " alt="" />
      <img src="/assets/images/Line.png" className="absolute left-4 top-20 h-4/5  w-[50px] " alt="" />

        <img src="/assets/images/madir.png" className="absolute bottom-[0px]  w-[90%] h-[500px] " alt="" />
        
       



        {/* {viewModal ? (
        <>   <NamasteModal isVisible={viewModal} onClose={() => setViewModal(false)} /> </>
      ) : ( */}
        <div className="flex justify-center w-full mt-[-140px]">
          {/* <div className="w-[450px] md:mr-20  hidden md:block  rounded-4xl justify-center items-center">
            <div className=" md:flex hidden  rounded-4xl h-full flex-col justify-center items-center text-center [border-radius:20px] ">
              <Image priority={true} className="flex pb-4 rounded-2xl" src={`/assets/images/banner.webp`} width={3000} height={3000} alt={"welcome"} />
            </div>
          </div> */}
          <div className="">
            <div className=" flex flex-col justify-center items-center text-center">
              <Image priority={true} className="flex mb-4 pt-2 " src={`/assets/images/abplogo.png`} width={80} height={80} alt={"welcome"} />
            </div>

            <div className={`z-10 flex  flex-col  md:h-fit md:max-w-lg rounded-xl bg-gradient-to-r from-gray-400/10 to-gray-200/10     border-2 border-white p-4 md:px-8`}>
              {steps == 0 && (
                <>
                  <div className="flex flex-col w-full md:max-w-md  space-y-4  md:px-0 ">
                    <div className="flex items-center justify-center font-bold w-full text-center py-4 text-white ">
                      <h1 className="text-[26px]  text-[#F7D07C] font-[700] ">आपका रामभूमि अयोध्या में स्वागत है</h1>
                    </div>
                    {/* <div className={" pt-5 pl-2"}>{isMale == undefined && <div className="flex  text-white">Please Enter Your Name</div>}</div> */}

                    <div className="bg-white rounded-xl p-2">
                      {/* <h1 className="text-transparent text-lg bg-clip-text bg-gradient-to-r pl-2 from-[#dba649] to-custom-orange font-bold pt-px">Enter Your Name </h1> */}
                      <div className="flex flex-row justify-center items-center">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.6175 9.11382C21.6175 12.7851 18.6739 15.7289 15 15.7289C11.3274 15.7289 8.38252 12.7851 8.38252 9.11382C8.38252 5.44253 11.3274 2.5 15 2.5C18.6739 2.5 21.6175 5.44253 21.6175 9.11382ZM15 27.5C9.57797 27.5 5 26.6187 5 23.2187C5 19.8174 9.60673 18.9674 15 18.9674C20.4233 18.9674 25 19.8487 25 23.2487C25 26.65 20.3933 27.5 15 27.5Z" fill="#531414"/>
</svg> 
                        <input
                          type="text"
                          name="username"
                          placeholder={"अपना नाम दर्ज करें"}
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setWarning("");
                          }}
                          className={"w-full flex caret-black flex-col rounded-lg bg-white px-4 py-2 hover:border-none hover:outline-none outline-none border-none hover:bg-gray-100 text-black font-semibold text-xs "}
                        />
                      </div>
                    </div>
                    <div className="grid grid-flow-row grid-cols-2 gap-5">
                      <div className="bg-white rounded-xl p-2">
                        {/* <h1 className="text-transparent text-lg bg-clip-text bg-gradient-to-r pl-2 from-[#dba649] to-custom-orange font-bold pt-px">Enter Your Name </h1> */}
                        <div className="flex flex-row justify-center items-center">
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9438 27C11.9266 27 11.9093 26.9983 11.8922 26.995C11.8049 26.9779 11.7319 26.9184 11.6974 26.8363L9.53304 21.6745C9.02236 21.8206 8.66374 21.7824 8.44072 21.5593C8.2177 21.3363 8.17947 20.9777 8.32552 20.467L3.16376 18.3024C3.12335 18.2855 3.08774 18.2589 3.06005 18.2249C3.03237 18.1909 3.01347 18.1507 3.00502 18.1077C2.99656 18.0647 2.99882 18.0203 3.01159 17.9784C3.02435 17.9365 3.04724 17.8983 3.07822 17.8674L4.47824 16.4673C4.51143 16.4342 4.55275 16.4103 4.59807 16.3982C4.64339 16.3861 4.6911 16.3861 4.73641 16.3982L9.77012 17.7515C10.8701 16.1061 12.4663 14.0958 14.3033 12.0422L3.2877 7.1943C3.24793 7.17682 3.21303 7.1499 3.18602 7.11587C3.15902 7.08185 3.14072 7.04175 3.13271 6.99906C3.12471 6.95636 3.12724 6.91236 3.14009 6.87087C3.15293 6.82937 3.17571 6.79164 3.20644 6.76094L5.03726 4.93012C5.10548 4.86189 5.20543 4.83567 5.29834 4.86189L8.49712 5.76067L9.93057 4.32722C10.1536 4.1042 10.4428 3.9722 10.7448 3.95523C11.0584 3.93757 11.3477 4.04506 11.56 4.25728C11.7724 4.46968 11.8797 4.75904 11.8622 5.0724C11.8454 5.37463 11.7134 5.66382 11.4904 5.88684L10.9324 6.44483L12.361 6.84648L13.718 5.48948C13.941 5.26646 14.2302 5.13446 14.5323 5.11749C14.8457 5.1 15.1352 5.20731 15.3474 5.41954C15.5598 5.63193 15.6671 5.9213 15.6496 6.23466C15.6328 6.53688 15.5008 6.82608 15.2778 7.0491L14.7963 7.53063L17.8014 8.37507C17.8041 8.37575 17.8067 8.37661 17.8092 8.37747L17.8146 8.37918C19.9622 6.29946 21.9041 4.73333 23.4363 3.84603C24.1833 3.41336 24.8294 3.14371 25.3566 3.04428C25.9373 2.93474 26.3813 3.02868 26.676 3.32336C26.9707 3.61804 27.0646 4.0622 26.9549 4.64333C26.8553 5.1708 26.5853 5.81707 26.1525 6.56465C25.265 8.09668 23.6994 10.0381 21.6204 12.185L21.6221 12.1901C21.6229 12.1927 21.6236 12.1954 21.6245 12.198L22.4689 15.2029L22.9504 14.7214C23.1735 14.4984 23.4627 14.3664 23.7649 14.3496C24.0784 14.3321 24.3678 14.4396 24.5802 14.6518C25.0101 15.0817 24.9789 15.8127 24.5104 16.2812L23.1534 17.6382L23.5549 19.0668L24.1129 18.5088C24.3359 18.2858 24.6251 18.1538 24.9273 18.137C25.2407 18.1194 25.5302 18.227 25.7426 18.4392C26.1725 18.8692 26.1413 19.6001 25.6728 20.0686L24.2394 21.5021L25.1383 24.7009C25.1644 24.7938 25.1383 24.8937 25.0701 24.9619L23.2389 26.7931C23.2082 26.8238 23.1705 26.8465 23.129 26.8594C23.0875 26.8722 23.0435 26.8748 23.0008 26.8668C22.9143 26.8505 22.8412 26.7926 22.8056 26.7118L17.9579 15.6963C15.9039 17.5334 13.8934 19.1297 12.2484 20.2294L13.6015 25.263C13.6263 25.3552 13.5999 25.4536 13.5324 25.5211L12.1323 26.9211C12.0819 26.9724 12.0139 27 11.9438 27Z" fill="#531414" />
                          </svg>
                          <input
                            type="text"
                            name="username"
                            placeholder={"अपनी उड़ान का नाम ढूंढें"}
                            onChange={(e) => {
                              setflight(e.target.value);
                              setWarning("");
                            }}
                            className={"w-full flex caret-black flex-col rounded-lg bg-white px-4 py-2 hover:border-none hover:outline-none outline-none border-none hover:bg-gray-100 text-black font-semibold text-xs "}
                          />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-2">
                        {/* <h1 className="text-transparent text-lg bg-clip-text bg-gradient-to-r pl-2 from-[#dba649] to-custom-orange font-bold pt-px">Enter Your Name </h1> */}
                        <div className="flex flex-row justify-center items-center">
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2123 9.44211L6.96777 16.1038C6.99664 16.222 7.02596 16.3338 7.0539 16.4348L16.5986 18.5096C17.0655 18.0781 17.4644 17.5697 17.6702 17.2913L18.3611 17.2941C18.4407 17.2948 18.5191 17.275 18.5889 17.2365C18.6586 17.1981 18.7173 17.1424 18.7593 17.0748C18.8013 17.0071 18.8252 16.9298 18.8286 16.8502C18.8321 16.7707 18.815 16.6916 18.7791 16.6205C18.6487 16.3598 18.5873 16.0987 18.7502 15.9357C18.834 15.8515 18.9667 15.8063 19.1394 15.7849C19.3936 15.7542 19.7153 15.7844 20.1119 15.8836C20.1806 15.901 20.2523 15.9024 20.3216 15.8879C20.3909 15.8733 20.4559 15.843 20.5118 15.7995C20.5676 15.7559 20.6127 15.7001 20.6437 15.6365C20.6747 15.5728 20.6907 15.5028 20.6905 15.432V13.5699C20.6906 13.4722 20.6598 13.3769 20.6027 13.2976C20.5455 13.2183 20.4649 13.159 20.3721 13.1281L19.6515 12.8879C19.9718 12.509 20.3768 11.9797 20.6412 11.4504C20.6869 11.3602 20.7019 11.2576 20.684 11.1581C20.6661 11.0586 20.6164 10.9677 20.5422 10.899C20.468 10.8304 20.3735 10.7877 20.2729 10.7776C20.1723 10.7675 20.0712 10.7904 19.9848 10.8429C19.1748 11.3293 18.6339 11.5184 18.2126 11.4858C17.8913 11.4611 17.6665 11.2884 17.443 11.077C17.2438 10.8885 17.0501 10.6678 16.8299 10.4476C16.773 10.3909 16.7024 10.3497 16.6249 10.3283C16.5474 10.3068 16.4657 10.3058 16.3877 10.3252C14.9837 10.6762 14.1695 10.1241 13.2123 9.44211Z" fill="#531414" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.92896 15.9422C7.01042 16.2942 7.09887 16.6024 7.1552 16.7886L6.77347 17.5516C6.72965 17.6389 6.71448 17.7378 6.7301 17.8343C6.74573 17.9307 6.79137 18.0198 6.86052 18.0888C7.21944 18.4477 7.59745 19.1614 7.239 19.8792C7.21155 19.9338 7.19517 19.9933 7.19077 20.0542C7.18638 20.1152 7.19407 20.1764 7.21339 20.2344C7.42148 20.8582 7.71337 21.3084 7.9843 21.7297H12.8863C12.8416 21.3768 12.8179 21.0109 12.8895 20.7227C13.188 20.7055 13.3784 20.8819 13.3784 20.8819C13.4435 20.9469 13.5264 20.991 13.6166 21.0089C13.7068 21.0268 13.8003 21.0175 13.8852 20.9823C13.9702 20.9471 14.0428 20.8875 14.0939 20.8111C14.1451 20.7346 14.1724 20.6448 14.1725 20.5528C14.1727 20.4974 14.1894 20.4432 14.2205 20.3973C14.2282 20.3868 14.2369 20.3772 14.2466 20.3685C14.2688 20.3824 14.2897 20.3985 14.3089 20.4164C14.3832 20.4901 14.4801 20.5367 14.5841 20.5486C14.6881 20.5605 14.793 20.537 14.882 20.482C14.9711 20.427 15.039 20.3437 15.0749 20.2454C15.1107 20.1471 15.1125 20.0396 15.0798 19.9402C15.0798 19.9402 15.024 19.7679 15.0296 19.5687C15.0324 19.4756 15.0435 19.3704 15.1096 19.2903C15.1902 19.1935 15.3387 19.1562 15.5691 19.1562C15.6414 19.1563 15.7127 19.1394 15.7772 19.1069C16.2013 18.8951 16.6273 18.5068 16.9801 18.127L6.92896 15.9422Z" fill="#531414" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8598 21.4839H7.8275C7.93132 21.6491 8.03513 21.8065 8.13335 21.9634C8.38055 22.3591 8.58631 22.7524 8.58631 23.346C8.58631 23.4693 8.63519 23.588 8.72271 23.6751C9.12213 24.0745 9.51736 24.4758 9.51736 25.6736C9.51736 26.2187 10.0397 27.3197 10.5848 27.8648C10.6591 27.9385 10.756 27.9851 10.86 27.997C10.9639 28.0089 11.0689 27.9854 11.1579 27.9305C11.2469 27.8755 11.3149 27.7921 11.3507 27.6938C11.3866 27.5955 11.3884 27.488 11.3557 27.3886C11.2839 27.1846 11.2335 26.9737 11.2054 26.7592C11.1953 26.6792 11.1942 26.5983 11.2021 26.5181C11.2054 26.4892 11.2165 26.452 11.2226 26.4324C11.2412 26.4324 11.2738 26.4315 11.2957 26.4347C11.3962 26.4492 11.5098 26.492 11.6369 26.5558C11.7079 26.5913 11.7869 26.608 11.8662 26.6044C11.9455 26.6008 12.0226 26.5769 12.0901 26.5351C12.1576 26.4933 12.2133 26.435 12.2519 26.3656C12.2904 26.2962 12.3106 26.2181 12.3105 26.1387C12.3105 26.0237 12.3789 25.9138 12.4651 25.8277C12.5512 25.7416 12.6611 25.6731 12.776 25.6731C12.8679 25.6727 12.9576 25.6451 13.0338 25.5939C13.1101 25.5426 13.1695 25.47 13.2047 25.3852C13.2398 25.3003 13.2491 25.2069 13.2314 25.1168C13.2137 25.0267 13.1698 24.9438 13.1052 24.8785C12.9562 24.7295 12.8924 24.5005 12.8924 24.2766C12.8924 24.0522 12.9557 23.8241 13.1052 23.6746C13.2299 23.5499 13.2732 23.3655 13.2178 23.1984C13.2178 23.1984 12.9809 22.4875 12.8859 21.7292C12.8757 21.6474 12.8668 21.5655 12.8594 21.4834L12.8598 21.4839ZM9.16403 5.96091L9.25248 6.04936L8.32794 6.66525C8.2642 6.70777 8.21195 6.76537 8.17581 6.83294C8.13967 6.9005 8.12077 6.97594 8.12078 7.05256C8.12078 7.05256 8.11892 7.44873 7.96995 7.8947C7.83542 8.29831 7.58077 8.75918 7.04263 8.93841C6.90343 8.98496 6.7945 9.09389 6.74795 9.23309C6.60736 9.65532 6.22423 9.88948 5.83598 10.0417C5.14607 10.3112 4.39658 10.3112 4.39658 10.3112C4.29179 10.3114 4.1901 10.3468 4.10797 10.4119C4.02584 10.477 3.96806 10.5679 3.94399 10.6698C3.91993 10.7718 3.93097 10.879 3.97534 10.9739C4.01971 11.0688 4.09481 11.146 4.18849 11.193L4.8621 11.53V12.1733C4.8621 12.2967 4.91098 12.4154 4.9985 12.5025C4.9985 12.5025 5.27689 12.785 5.83552 13.1379C5.5885 13.2425 5.33229 13.3238 5.07019 13.3809C4.25226 13.5695 3.46553 13.5699 3.46553 13.5699C3.34206 13.5699 3.22365 13.619 3.13635 13.7063C3.04905 13.7936 3 13.912 3 14.0355C3 14.1589 3.04905 14.2773 3.13635 14.3646C3.22365 14.4519 3.34206 14.501 3.46553 14.501H5.56644L5.54643 14.5135C5.16051 14.7547 4.78296 14.9665 4.39658 14.9665C4.29887 14.9665 4.20364 14.9972 4.12438 15.0544C4.04512 15.1115 3.98584 15.1921 3.95494 15.2848C3.92404 15.3775 3.92309 15.4776 3.95223 15.5708C3.98136 15.6641 4.0391 15.7458 4.11726 15.8044L5.04831 16.5027C5.11746 16.5546 5.1997 16.5862 5.2858 16.5939C5.37189 16.6016 5.45844 16.5852 5.53572 16.5465C5.80433 16.4124 6.14556 15.9841 6.50727 15.5591C6.59945 15.4511 6.69395 15.3445 6.79171 15.25C6.86721 15.7012 6.96887 16.1476 7.09616 16.587L7.50815 16.3631L13.4362 9.60039C13.2783 9.49006 13.1182 9.37461 12.952 9.25729L13.6289 8.24198C13.6678 8.18363 13.693 8.11725 13.7026 8.04779C13.7123 7.97833 13.7061 7.90759 13.6846 7.84085C13.663 7.77411 13.6267 7.7131 13.5783 7.66237C13.5299 7.61164 13.4706 7.5725 13.405 7.54788L11.973 7.01067C12.0037 6.77511 11.9614 6.5363 11.8641 6.29841L9.16403 5.96091ZM10.4489 7.51809C10.0847 7.52749 9.73865 7.67876 9.48441 7.93964C9.23018 8.20053 9.0879 8.55039 9.0879 8.91467C9.0879 9.27894 9.23018 9.62881 9.48441 9.88969C9.73865 10.1506 10.0847 10.3018 10.4489 10.3112C10.813 10.3018 11.1591 10.1506 11.4133 9.88969C11.6676 9.62881 11.8099 9.27894 11.8099 8.91467C11.8099 8.55039 11.6676 8.20053 11.4133 7.93964C11.1591 7.67876 10.813 7.52749 10.4489 7.51809Z" fill="#531414" />
                            <path d="M10.4482 9.37974C10.7053 9.37974 10.9137 9.17131 10.9137 8.91421C10.9137 8.65711 10.7053 8.44868 10.4482 8.44868C10.1911 8.44868 9.98267 8.65711 9.98267 8.91421C9.98267 9.17131 10.1911 9.37974 10.4482 9.37974Z" fill="#531414" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1657 11.6431L19.9082 12.2171L20.3505 11.7749L21.1559 12.0435V12.1733C21.1557 12.2423 21.1708 12.3104 21.2002 12.3728C21.2296 12.4351 21.2725 12.4902 21.3258 12.5339C21.3791 12.5776 21.4415 12.6089 21.5084 12.6255C21.5753 12.6422 21.6451 12.6437 21.7126 12.63C21.7126 12.63 22.4821 12.475 23.1897 12.5365C23.3946 12.5546 23.5947 12.5895 23.7619 12.6608L23.8033 12.6794C23.7535 12.7162 23.6981 12.7511 23.6418 12.7878C23.3992 12.9471 23.1148 13.0946 22.869 13.2631C22.4095 13.5783 22.0869 13.9726 22.0869 14.501C22.0874 14.5928 22.1149 14.6825 22.1662 14.7588C22.2174 14.835 22.29 14.8944 22.3749 14.9296C22.4597 14.9648 22.5531 14.9741 22.6432 14.9564C22.7334 14.9387 22.8163 14.8947 22.8816 14.8301C23.0594 14.6523 23.2195 14.4917 23.361 14.3674L23.3969 14.3376C23.4337 14.575 23.4835 14.9805 23.4835 15.432C23.4834 15.5426 23.5227 15.6497 23.5944 15.7339C23.666 15.8182 23.7653 15.8742 23.8745 15.8919C23.9837 15.9096 24.0956 15.8878 24.1902 15.8305C24.2848 15.7732 24.3559 15.6841 24.3908 15.5791C24.6459 14.8129 24.6468 14.3022 24.6468 13.9191C24.6468 13.7152 24.6077 13.5695 24.7437 13.4335C24.779 13.3981 24.8084 13.3573 24.8307 13.3125L25.2962 12.3814C25.3399 12.2941 25.355 12.1952 25.3394 12.0988C25.3238 12.0024 25.2782 11.9133 25.2092 11.8442C25.083 11.7181 25.158 11.5174 25.2446 11.3759C25.2767 11.3228 25.3526 11.2549 25.3679 11.2414C25.4522 11.2377 25.5338 11.211 25.604 11.1641L27.0005 10.233C27.0949 10.1701 27.1629 10.0748 27.192 9.96517C27.221 9.85553 27.2091 9.73907 27.1583 9.63763L26.6928 8.70658C26.6601 8.64041 26.612 8.58301 26.5526 8.53916C26.4932 8.4953 26.4242 8.46625 26.3513 8.45441C26.2784 8.44257 26.2038 8.4483 26.1335 8.4711C26.0633 8.49391 25.9995 8.53314 25.9475 8.58554C25.8204 8.71263 25.7054 8.79829 25.5783 8.79829C25.4513 8.79829 25.3363 8.71263 25.2092 8.58554C25.1441 8.52046 25.0611 8.47614 24.9709 8.45818C24.8806 8.44023 24.787 8.44945 24.7019 8.48467C24.6169 8.5199 24.5442 8.57955 24.493 8.65609C24.4419 8.73263 24.4146 8.82261 24.4145 8.91467C24.4145 9.58596 23.6892 9.84572 23.018 9.84572C22.9259 9.84574 22.8359 9.87305 22.7594 9.92421C22.6828 9.97536 22.6232 10.0481 22.588 10.1331C22.5527 10.2182 22.5435 10.3117 22.5615 10.402C22.5794 10.4923 22.6237 10.5753 22.6888 10.6404C22.8532 10.8047 23.0203 10.9672 23.132 11.1315C23.146 11.1534 23.1623 11.1734 23.1758 11.1934L20.6899 10.8387V9.84572C20.689 9.73265 20.647 9.62377 20.5718 9.53936C20.4965 9.45495 20.3932 9.40078 20.2809 9.38694C20.1687 9.3731 20.0553 9.40053 19.9618 9.46412C19.8683 9.52772 19.8011 9.62314 19.7728 9.7326L19.3389 11.4699L19.1657 11.6431ZM8.99865 6.21788L11.9454 6.54607C11.9187 6.43878 11.8821 6.33421 11.836 6.23371C11.749 6.04005 11.6191 5.84546 11.4711 5.65599H12.3104C12.4023 5.65553 12.4919 5.62796 12.5682 5.57673C12.6444 5.5255 12.7039 5.4529 12.739 5.36803C12.7742 5.28316 12.7835 5.1898 12.7658 5.09966C12.7481 5.00952 12.7042 4.92661 12.6395 4.86134L12.1102 4.33157L13.0343 3.71568C13.1153 3.66169 13.1773 3.58366 13.2117 3.49258C13.246 3.4015 13.251 3.30194 13.2258 3.20791C13.2006 3.11388 13.1466 3.03011 13.0713 2.96837C12.996 2.90664 12.9033 2.87006 12.8062 2.86377C12.7975 2.82894 12.7909 2.79366 12.7862 2.75809C12.775 2.64497 12.7759 2.52067 12.7759 2.39684C12.7755 2.30498 12.7479 2.2153 12.6967 2.13905C12.6454 2.0628 12.5728 2.00337 12.488 1.96822C12.4031 1.93307 12.3097 1.92376 12.2196 1.94146C12.1295 1.95916 12.0465 2.00308 11.9813 2.06772C11.7648 2.28419 11.5493 2.50205 11.3328 2.66452C11.2528 2.72919 11.1653 2.7839 11.0721 2.82745C10.5461 2.30932 9.66808 1.48627 8.79428 1.04915C8.73965 1.02178 8.68015 1.00547 8.61919 1.00116C8.55824 0.996844 8.49703 1.00461 8.43909 1.02401L7.04251 1.48953C6.94846 1.52123 6.86698 1.58213 6.80996 1.66335C6.75293 1.74458 6.72332 1.8419 6.72545 1.94112C6.72758 2.04035 6.76133 2.1363 6.8218 2.21501C6.88226 2.29371 6.96627 2.35106 7.0616 2.37869C7.53317 2.51369 7.86602 2.64497 8.09041 2.77625C8.16582 2.82047 8.23938 2.88425 8.27895 2.92149C8.26742 2.93445 8.2553 2.94688 8.24263 2.95873C8.19165 3.00448 8.13683 3.04575 8.07877 3.0821C7.89866 3.19199 7.70733 3.28235 7.50804 3.35164C7.44481 3.3728 7.38686 3.40729 7.33811 3.45277C7.28935 3.49825 7.25092 3.55366 7.22542 3.61526C7.19991 3.67686 7.18792 3.74322 7.19026 3.80986C7.19259 3.87649 7.2092 3.94184 7.23896 4.00151L7.70449 4.93256C7.74916 5.02286 7.82228 5.09598 7.91258 5.14065L8.77613 5.57266L9.25189 6.04889L8.99865 6.21788Z" fill="#531414" />
                          </svg>
                          <input
                            type="text"
                            name="username"
                            placeholder={"अपने राज्य का नाम चुनें"}
                            onChange={(e) => {
                              setState(e.target.value);
                              setWarning("");
                            }}
                            className={"w-full flex caret-black flex-col rounded-lg bg-white px-4 py-2 hover:border-none hover:outline-none outline-none border-none hover:bg-gray-100 text-black font-semibold text-xs "}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {steps == 0 && (
                <>
                  <div className={"h-12  text-center flex justify-start items-center" + (username && username.length > 3 ? "" : " opacity-10")}>
                    {isMale == undefined && <div className="flex w-full text-start justify-center items-center text-white"></div>}
                  </div>

                  <div className={styles.buttonGroup + (username && username.length > 3 ? "" : " opacity-10")}>
                    {" "}
                    <div
                      onClick={() => {
                        setIsMale(true);
                        handleNext();
                      }}
                      className={styles.homeButton + " " + (isMale ? styles.isHomeActive : "")}
                    >
                      {/* <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frenderapi.s3.amazonaws.com%2Fnuveken06.png&f=1&nofb=1&ipt=1ad28c158cb5d74cc15efb61c0bcb046b0de945fc21e54e048d9a8689043675f&ipo=images" alt="male avatar" /> */}
                       {/* <img src="/assets/images/man.png" alt="" /> */}
                      Male
                    </div>
                    <div
                      onClick={() => {
                        setIsMale(false);
                        handleNext();
                      }}
                      className={styles.homeButton + " " + (isMale === false ? styles.isHomeActive : "")}
                    >
                      {/* <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frenderapi.s3.amazonaws.com%2FmYhZ2k6vA.png&f=1&nofb=1&ipt=ce4e5f9789fd79ddcec2362afbbe50f4032679cf89813d1eff7eec73433e41ce&ipo=images" alt="male avatar" /> */}
                      Female
                    </div>
                  </div>
                  <br />
                </>
              )}
              {steps == 1 && (
                <div className={"AVATARS flex md:h-full flex-col items-center justify-center space-y-4 pt-4"}>
                  <div className="flex flex-col shrink-0 gap-1 grow w-full max-w-2xl justify-center items-center ">
                    <h1 className="self-center text-white/50 text-lg font-bold">Select Your Avatar</h1>
                    <div className="flex flex-row  gap-3  overflow-x-hidden ">
                      {isMale &&
                        allAvatarModels.map((model, index) => {
                          return (
                            <div key={index} className="flex shrink-0 flex-col gap-3 py-2 border border-gray-400 rounded-xl">
                              <Image
                                width={100}
                                height={100}
                                unoptimized
                                priority={true}
                                alt="avatar"
                                src={model.link}
                                onClick={() => {
                                  //   window.open("https://metaverse-elections.netlify.app?avatarUrl=" + avatarUrlSplitter(model.name) + "&name=" + username + "&gender=" + (isMale ? "male" : "female"));
                                  // window.open("https://elections.abpverse.com/?avatarUrl=" + avatarUrlSplitter(model.name) + "&name=" + username + (isSafari ? "&browser=safari" : ""));
                                  window.open("http://moonsdemo.world/")
                                }}
                                className={`flex shrink-0 md:w-28 w-24  md:h-28 h-24 object-cover bg-transparent   md:mt-0 ${avatarUrl == model.name ? " border-4  border-gray-400 rounded-lg cursor-pointer" : "bg-gray-400 cursor-pointer rounded-lg"}`}
                              />
                            </div>
                          );
                        })}
                      {isMale == false &&
                        femaleAvatarModels.map((model, index) => {
                          return (
                            <div key={index} className="flex shrink-0 flex-col gap-3 py-2 border border-gray-400 rounded-xl">
                              <Image
                                width={100}
                                height={100}
                                unoptimized
                                priority={true}
                                alt="avatar"
                                src={model.link}
                                onClick={() => {
                                  //   window.open("https://metaverse-elections.netlify.app?avatarUrl=" + avatarUrlSplitter(model.name) + "&name=" + username + "&gender=" + (isMale ? "male" : "female"));
                                  // window.open("https://elections.abpverse.com/?avatarUrl=" + avatarUrlSplitter(model.name) + "&name=" + username + (isSafari ? "&browser=safari" : ""));
                                  window.open("http://moonsdemo.world/")
                                }}
                                className={`flex shrink-0 md:w-28 w-24  md:h-28 h-24 object-cover bg-transparent   md:mt-0 ${avatarUrl == model.name ? " border-4  border-gray-400 rounded-lg cursor-pointer" : "bg-gray-400 cursor-pointer rounded-lg"}`}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* <div className="text-white font-bold animate-pulse flex justify-center">{warning}</div> */}
                </div>
              )}

              {steps == 1 && avatarUrl == "" && username && username != "" && username.length > 3 && (
                <>
                  {/* <div className="flex justify-center">
                    <div className="h-px bg-custom-orange w-1/2 mt-2 mx-2 "></div>
                    <div className="text-custom-orange">OR</div>
                    <div className="h-px bg-custom-orange w-1/2 mt-2 mx-2"></div>
                  </div> */}
                  {/* <div className="flex mt-4  flex-col space-y-4  mb-8">
                    <div onClick={() => setIsFrameOpen(true)} className="bg-gradient-to-r from-[#dba649] to-custom-orange rounded-xl w-full border-2 cursor-pointer border-custom-orange max-w-md    text-center self-center md:p-4 p-4 text-white text-xl font-bold">
                      Create Custom Avatar
                    </div>
                  </div> */}
                </>
              )}
              {steps == 1 && avatarUrl && avatarUrl != "" && combineAndLoadAnimation(avatarUrl)}

              {/* {steps == 2 && avatarUrl != "" && username && username != "" && username.length > 3 && (
                <div className="flex mt-4  flex-col space-y-4  mb-8">
                  <div onClick={() => combineAndLoadAnimation(avatarUrl)} className="bg-gradient-to-r from-[#dba649] to-custom-orange rounded-xl w-full border-2 cursor-pointer border-custom-orange max-w-md    text-center self-center md:p-4 p-4 text-white text-xl font-bold">
                    Confirm Avatar
                  </div>
                </div>
              )} */}

              {steps == 2 && avatarUrl && avatarUrl != "" && (
                <>
                  <div className="gradient_blue w-screen h-screen overflow-hidden fixed top-0 left-0">
                    <div className="absolute top-1/2 -translate-y-1/2 flex z-20 flex-col justify-center items-center">
                      {
                        <div className="flex flex-col text-white items-center justify-center w-screen text-center">
                          <img src="/assets/images/loader.gif" className="my-8 w-[300px] h-[300px]" />
                          {progress === 100 ? (
                            <h1>Please Click on the Button below to Enter Independence Day Event</h1>
                          ) : (
                            <div className="flex flex-col gap-4">
                              <div className="py-2">Thanks for Submitting Your Picture</div> Loading {progress > 0 ? <>: {progress}%</> : <></>}..
                            </div>
                          )}
                        </div>
                      }
                      {steps == 2 && progress == 100 && avatarUrl != "" && username && username != "" && username.length > 3 && progress == 100 && (
                        <div className="flex mt-4  flex-col space-y-4  mb-8">
                          <div onClick={() => takeToTheMetaverse()} className="bg-gradient-to-r from-[#dba649] to-gray-400 rounded-xl w-full border-2 cursor-pointer border-gray-400 max-w-md    text-center self-center md:p-4 p-4 px-6 text-white text-xl font-bold">
                            Enter Event
                          </div>
                        </div>
                      )}
                    </div>
                    <video className="mix-blend-soft-light object-fill h-screen w-full" autoPlay muted loop playsInline>
                      <source src="/assets/images/perspective.mp4" type="video/mp4" />
                      Video formats are not supported by your browser
                    </video>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* // )} */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 mx-auto w-full hidden sm:block">
        {/* <img src="/assets/images/banner-desktop.gif" className='mx-auto' alt="abp-live" /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full md:hidden">
        <img src="/assets/images/banner.gif" alt="abp-live" />
      </div>
      {/* {isFrameOpen && <AvatarIframe setRpmFrame={setIsFrameOpen} setReadyPlayerUrl={setAvatarUrl} isMale={isMale} />} */}

      {isFrameOpen && <AvatarIframe setRpmFrame={setIsFrameOpen} setReadyPlayerUrl={setAvatarUrl} isMale={isMale} />}
    </>
  );
}
