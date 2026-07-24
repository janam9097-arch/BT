import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Products from "../Products/Products";
import Footer from "../../components/Footer/Footer";
import Categories from "../Categories/Categories";

function Home() {
  return (
    <>
      <Navbar />
      <Categories/>
      <Hero />
      <Products />
      <Footer />
    </>
  );
}

export default Home;