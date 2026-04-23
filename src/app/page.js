import Image from "next/image";
import HomePage from "./(pages)/Home/page.jsx";
import HeaderTop from "@/components/Header-top.jsx";
import Navbar from "@/components/Navbar.jsx";
import Showcase from "@/components/Showcase.jsx";
import NewArraivals from "@/components/New-Arraivals.jsx";

export default function Home() {
  return (
    <div>
      <div>
        <Showcase />
        <NewArraivals />
      </div>
    </div>
  );
}
