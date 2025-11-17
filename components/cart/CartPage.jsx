"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { ShoppingCartIcon } from "lucide-react";
import { FaArrowRight, FaShippingFast, FaTrash } from "react-icons/fa";

import PaymentForm from "@/components/cart/PaymentForm";
import ShippingForm from "@/components/cart/ShippingForm";
import useCartStore from "@/components/cart/cartStore";

const steps = [
  {
    id: 1,
    title: "Položky",
  },
  {
    id: 2,
    title: "Adresa",
  },
  {
    id: 3,
    title: "Platba",
  },
];

function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingFormValid, setShippingFormValid] = useState(false);

  const activeStep = parseInt(searchParams.get("step") || "1");

  const {
    cart,
    removeFromCart,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
  } = useCartStore();

  return (
    <section className="container pt-5 pb-15 min-h-[500px]">
      {cart.length ? (
        <div className="flex flex-col gap-8 items-center justify-center bg-white">
          {/* TITLE */}
          <h1 className="h1">Nákupní košík</h1>
          {/* STEPS */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 border-b-2 pb-4 ${
                    step.id === activeStep
                      ? "border-gray-800 text-primary"
                      : "border-gray-300 text-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                      step.id === activeStep ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  >
                    {step.id}
                  </div>
                  <p>{step.title}</p>
                </div>
              );
            })}
          </div>
          {/* ITEMS + DETAILS */}
          <div className="w-full flex flex-col lg:flex-row gap-16">
            {/* ITEMS */}
            <div className="w-full lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
              {activeStep === 1 ? (
                cart.map((item, i) => {
                  return (
                    // SINGLE CART ITEM
                    <div className="flex items-center justify-between" key={i}>
                      {/* IMAGE AND DETAILS */}
                      <div className="flex gap-8 items-center">
                        {/* IMAGE */}
                        <div className="relative w-50 h-50 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={item.images.side}
                            width={200}
                            height={200}
                            alt=""
                          />
                        </div>
                        {/* ITEM DETAILS */}
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Počet: {item.quantity || 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              Barva popruhu: {item.colorStrap}
                            </p>
                            <p className="text-xs text-gray-500">
                              Barva látky: {item.colorFabric}
                            </p>
                          </div>
                          <p className="font-medium mt-8">{item.price} Kč</p>
                        </div>
                      </div>
                      {/* DELETE BUTTTON */}
                      <button
                        onClick={() => removeFromCart(item)}
                        className="w-10 h-10 rounded-full bg-red-100 text-red-400 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-red-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })
              ) : activeStep === 2 ? (
                <ShippingForm setShippingFormValid={setShippingFormValid} />
              ) : activeStep === 3 && shippingFormValid ? (
                <PaymentForm />
              ) : (
                <p className="text-sm text-gray-500">Prosím vyplňte adresu.</p>
              )}
            </div>
            {/* DETAILS */}

            <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
              <h3 className="h3">Podrobnosti</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <p>Celkem</p>
                  <p className="text-gray-500 font-medium">
                    {calculateSubtotal()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Doprava</p>
                  <p className="text-gray-500 font-medium">
                    {calculateShipping()}
                  </p>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <p>Celkem s dopravou</p>
                  <p className="text-primary font-semibold">
                    {calculateTotal()} Kč
                  </p>
                </div>
              </div>
              {activeStep === 1 && (
                <button
                  onClick={() => router.push("/cart?step=2", { scroll: false })}
                  className="btn btn-icon btn-accent"
                >
                  Další <FaArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center justify-center mt-12 bg-white">
          <h1 className="h1">Nákupní košík</h1>
          <p>Nákupní košík je prázdný.</p>
          <p>
            <ShoppingCartIcon />
          </p>
        </div>
      )}
    </section>
  );
}

export default CartPage;
