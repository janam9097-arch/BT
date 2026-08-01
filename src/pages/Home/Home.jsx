import React from "react";
import Hero from "../../components/Hero/Hero";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Products />
    </>
  );
}

export default Home;