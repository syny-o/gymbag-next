"use client";

import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import useCartStore from "@/components/cart/cartStore";

function ShoppingCartIcon() {
  const { cart } = useCartStore();

  return (
    <Link href="/cart" className="relative">
      <FaCartShopping className="text-primary" />
      <div className="absolute w-10 h-10 bg-accent p-2 -top-8 left-2 rounded-full text-white">
        {cart.length}
      </div>
    </Link>
  );
}

export default ShoppingCartIcon;
