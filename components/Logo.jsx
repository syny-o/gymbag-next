import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="text-white text-2xl xl:text-3xl font-bold flex items-center uppercase"
    >
      <div className="bg-white p-5 border-2 border-accent">
        <Image src="/assets/logo.png" alt="Logo" width={180} height={100} />
      </div>
    </Link>
  );
};

export default Logo;
