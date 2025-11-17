import Header from "@/components/Header";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import Customizer from "@/components/customizer/Customizer";
import Faq from "@/components/Faq";
import Category from "@/components/Category";

function page() {
  return (
    <div className="bg-white">
      <Topbar />
      <Header />
      <Customizer />
      <Category />
      <Faq />
      <Footer />

    </div>
  );
}

export default page;
