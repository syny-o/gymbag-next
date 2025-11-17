import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Sidenav from "./Sidenav";
import ShoppingCartIcon from "./cart/ShoppingCartIcon";

const Header = () => {
  return (
    <header className="mx-auto left-0 right-0 bg-grey-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-10">
          {/* logo & sidenav */}
          <div className="flex items-center justify-between w-full md:w-auto gap-8">
            <Link className="hidden md:flex" href={"/"}>
              <Image src="/assets/logo.png" width={160} height={60} alt="" />
            </Link>
            <div className="xl:hidden">
              <Sidenav />
            </div>
          </div>
          {/* nav (desktop) */}
          <nav className="hidden xl:flex gap-6 pl-24 text-primary">
            <a href="/" className="link-primary hover:text-accent2">
              Domů
            </a>
            <a href="/customizer" className="link-primary hover:text-accent2">
              Customizer
            </a>
            <a href="#" className="link-primary hover:text-accent2">
              O Nás
            </a>
            <a href="#" className="link-primary hover:text-accent2">
              Kontakt
            </a>
          </nav>
          {/* search, favorites, cart */}
          <div className="flex items-center justify-end gap-4 w-[360px]">
            {/* search */}
            <input
              className="hidden input w-[126px] focus:w-[200px] transition-all pl-7"
              type="search"
              placeholder="Search ..."
            />
            {/* favorites btn */}
            <button className="btn-icon btn-outline group">
              <FaHeart className="text-primary group-hover:text-primary/90" />
            </button>
            {/* cart btn */}
            <button className="btn-icon btn-outline hover:bg-accent">
              {/* <FaCartShopping className="text-primary" /> */}
              < ShoppingCartIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
