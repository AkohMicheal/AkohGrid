import ProductList from "@/components/ProductList";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="">
      <div className="relative aspect-[3/1] min-h-[160px] mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 via-neutral-800 to-black flex items-center justify-center p-8 text-white shadow-xl">
        <div className="relative z-10 text-center max-w-2xl px-4">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2 block">
            Curated Collection
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
            AkohGrid Essentials
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Modern activewear and everyday pieces crafted for comfort and longevity.
          </p>
        </div>
      </div>
      <ProductList category={category} params="homepage" />
    </div>
  );
};

export default Homepage;
