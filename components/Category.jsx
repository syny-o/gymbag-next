import Image from "next/image";
import Link from "next/link";

const Category = () => {
  return (
    <section className="mt-24 bg-gray-100 pb-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-[72px]">
          {/* <h4 className="h4 w-max border-b-2">Shop by Category</h4> */}
          <Link
            href="/"
            className="link-primary text-accent2 hover:text-primary"
          >
            {/* View All */}
          </Link>
        </div>
        {/* img grid */}
        <div className="grid grid-cols-3 gap-4 xl:gap-10 mb-10">
          {/* img 1 */}
          <div className="relative w-full h-[146px] sm:h-[416px] xl:h-[496px]">
            <Image
              src="/assets/img/category/model-side.jpg"
              fill
              quality={100}
              alt=""
              className="object-contain"
            />
          </div>
          {/* img 2 */}
          <div className="relative w-full h-[146px] sm:h-[416px] xl:h-[496px]">
            <Image
              src="/assets/img/category/model-back.jpg"
              fill
              quality={100}
              alt=""
              className="object-contain"
            />
          </div>
          {/* img 3 */}
          <div className="relative w-full h-[146px] sm:h-[416px] xl:h-[496px]">
            <Image
              src="/assets/img/category/model-front.jpg"
              fill
              quality={100}
              alt=""
              className="object-contain"
            />
          </div>
        </div>
        {/* category links */}


      </div>
    </section>
  );
};

export default Category;
