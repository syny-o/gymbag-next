"use client";

// import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";

import { ToastContainer, toast } from "react-toastify";

// import swiper styles
import "swiper/css";
import "swiper/css/scrollbar";

// import required modules
import { Scrollbar } from "swiper/modules";

import Image from "next/image";

import useCartStore from "./cart/cartStore";

import { products } from "./data/products";
import { FaShoppingCart } from "react-icons/fa";


const Slider = () => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Produkt byl přidán do košíku.");
  };

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={40}
        scrollbar={{ hide: false }}
        modules={[Scrollbar]}
        className="h-[550px]"
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1170: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product, index) => {

          return (
            <SwiperSlide
              key={index}
              className="select-none w-full cursor-pointer"
            >
              {/* product img */}
              <div className="bg-grey-50 h-[360px] flex items-center justify-center">
                <Image
                  src={product.images.side}
                  width={240}
                  height={240}
                  quality={100}
                  alt=""
                />
              </div>
              {/* text */}
              <div className="w-full pt-4 flex flex-col gap-4">
                <div>
                  <h6 className="font-semibold text-primary mb-1">{product.name}</h6>
                  <p>{product.description}</p>
                </div>
                <p className="font-semibold">{product.price} Kč</p>
              </div>
              <div className="my-2">
                <button onClick={()=>handleAddToCart(product)} className="w-30 h-10 flex items-center justify-around text-white bg-primary hover:bg-accent transition-all duration-200 cursor-pointer">
                  <FaShoppingCart /> <span>Do košíku</span>
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Slider;
