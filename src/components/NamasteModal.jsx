import Image from "next/image"
import { Outfit, Poppins } from "@next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "400", "300", "500", "600", "700"],
  subsets: ["latin"],
});
const NamasteModal = ({isVisible,onClose}) => {
    if (!isVisible) return null

  return (
    <div className="relative w-full h-full inset-0  flex justify-center items-center " onClick={() => onClose()}>
      <Image priority={true} className="absolute bottom-0 left-0 md:w-96 w-36 md:h-96 h-36 flex  rounded-2xl" src={`/assets/images/BlackSet.svg`} width={150} height={300} alt={"welcome"} />
      <Image priority={true} className="absolute bottom-0 right-0 md:w-96 w-36 md:h-96 h-36 flex  rounded-2xl" src={`/assets/images/WhiteSet.svg`} width={150} height={300} alt={"welcome"} />

      <div className="w-full max-w-md bg-gradient-to-r from-[#dba649]/5 to-custom-orange/5  border-2 border-custom-orange rounded-xl p-4  flex justify-items-center flex-col items-center gap-4 ">
        <Image priority={true} className="flex  rounded-2xl" src={`/assets/images/banner.webp`} width={150} height={300} alt={"welcome"} />
        <Image priority={true} className="flex  rounded-2xl" src={`/assets/images/loader.gif`} width={150} height={300} alt={"Loading..."} />
        <h1 className={`${poppins.className} text-white font-semibold`}>Welcome</h1>
      </div>
    </div>
  );
}

export default NamasteModal