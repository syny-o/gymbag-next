import About from "@/components/About";
import Category from "@/components/Category";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Latest from "@/components/Latest";
import Topbar from "@/components/Topbar";
import Services from "@/components/Services";
import Faq from "@/components/Faq";

const Home = () => {
  return (
    <div className="w-full  mx-auto overflow-hidden bg-white">
      <Topbar />
      <Header />
      <Hero />
      <Services />
      <Latest />
      <Cta />
      
      <About />
      <Category />
      <Faq />
      <Footer />

    </div>
  );
};

export default Home;
