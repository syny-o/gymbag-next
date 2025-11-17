import Header from "@/components/Header";
import CartPage from "../../components/cart/CartPage";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

function page() {
  return (
    <div className="bg-white">
      <Topbar />
      <Header />
      <CartPage />
      <Footer />
    </div>
  );
}

export default page;
