import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { CgMail } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { PiWhatsappLogoBold } from "react-icons/pi";



export default function HeaderTop() {
    return (
        <div className="flex justify-around bg-black p-1.5">
            <div className="flex gap-5 text-white text-[12px] font-bold">
                <p>আমাদের যে কোন পণ্য অর্ডার করতে Whatsapp করুন বা কল করুন</p>
                <div className="flex gap-1">
                    <FaPhoneAlt className="text-[16px] text-green-500" />
                    <p>+8801711111111</p>
                </div>
                <p>|</p>
                <div className="flex gap-1">
                    <div className="flex gap-2">
                        <PiWhatsappLogoBold className="text-[16px] text-green-500" />
                        <p>+8801711111111</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 text-white text-[16px] p-[2px]">
                <FaFacebookSquare />
                <FaYoutube />
                <FaInstagram />
                <AiFillTikTok />
                <CgMail />
                <FaPhoneAlt />
                <FaLinkedin />
            </div>
        </div>
    );
};