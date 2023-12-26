import React, { useEffect, useRef, useState } from "react";

const subdomain = "graphity"; // Replace with your custom subdomain

// props define

const AvatarIframe = ({  setRpmFrame, setReadyPlayerUrl, isMale }) => {
  const frame = useRef(null);
  const [value, setValue] = useState("");

  const saveGlbAvatar = async (glbURL) => {
    try {
      //   const response = await axiosInstance.post(
      //     '/api/v1/user/updateInfo',
      //     {
      //       glbAvatar: glbURL
      //     },
      //     {
      //       withCredentials: true
      //     }
      //   )
      //   console.log(response)
      //   showSuccess('Virtual avatar created!')
    } catch (err) {
      console.log(err);
      //   showError('Some error occurred')
    }
  };

  useEffect(() => {
    if (frame.current === null || frame.current === undefined) return;
    frame.current?.setAttribute("src", `https://${subdomain}.readyplayer.me/avatar?clearCache&frameApi&quality=low&morphTargets=none&gender=${isMale ? "male": "female"}`);
    // frame.current.setAttribute("src", `https://${subdomain}.readyplayer.me/avatar?frameApi&darkTheme`);

    function subscribe(event) {
      const json = parse(event);

      if (json?.source !== "readyplayerme") {
        return;
      }

      // Susbribe to all events sent from Ready Player Me once frame is ready
      if (json.eventName === "v1.frame.ready") {
        frame.current?.contentWindow?.postMessage(
          JSON.stringify({
            target: "readyplayerme",
            type: "subscribe",
            eventName: "v1.**",
          }),
          "*"
        );
        console.log("Frame is ready");
      }

      // Get avatar GLB URL
      if (json.eventName === "v1.avatar.exported") {
        setValue(json.data.url);
        console.log(json.data.url);
        saveGlbAvatar(json.data.url);
        // onOpen();
      }

      // Get user id
      if (json.eventName === "v1.user.set") {
        console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
      }
    }

    function parse(event) {
      try {
        return JSON.parse(event.data);
      } catch (error) {
        return null;
      }
    }

    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);

    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe);
    };
  }, []);

  useEffect(() => {
    if (value == null || value === "") return;
    updateValues();
  }, [value]);

  async function updateValues() {
    await localStorage.setItem("avatarUrl", value);
    setReadyPlayerUrl(value);
    // setAvatar(value);
    await localStorage.setItem("metaverseLink", "https://icc.streetverse.world/8iaQk64/surprised-informal-gala?name=" + "ICCPlayer" + "&avatarUrl=" + value.split("/")[3].split(".")[0]);
    // axios.get(value)
    setRpmFrame(false);
  }
  return (
    <div>
      <button onClick={() => setRpmFrame(false)} className="fixed bottom-2 text-2xl left-4 z-40 cursor-pointer rounded-[10px] bg-[#e34030] px-6 py-2 text-white ">
        Cancel
      </button>
      <div className={value == "" ? "fixed top-[2%] left-[2%] z-40 h-[90%] w-[96%] rounded-2xl shadow-xl  " : ""}>
        <iframe width="100%" height="100%" ref={frame} id="frame" className="frame" allow="camera *; microphone *; clipboard-write"></iframe>
      </div>
    </div>
  );
};

export default AvatarIframe;
