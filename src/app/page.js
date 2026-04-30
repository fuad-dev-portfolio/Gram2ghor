import Showcase from "@/components/Showcase.jsx";
import NewArraivals from "@/components/New-Arraivals.jsx";
import AllProducts from "@/components/AllProducts.jsx";
import TopSelling from "@/components/TopSelling.jsx";

export default function Home() {
  return (
    <div>
      <Showcase />
      <NewArraivals />
      <TopSelling />
      <AllProducts />
    </div>
  );
}
