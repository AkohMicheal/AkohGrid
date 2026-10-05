import ProductInteraction from "@/components/ProductInteraction";
import { mockProducts } from "@/lib/mockData";
import { ProductType } from "@repo/types";
import Image from "next/image";

const fetchProduct = async (id: string): Promise<ProductType> => {
  const serviceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
  if (!serviceUrl) {
    return mockProducts.find((p) => p.id === Number(id)) || mockProducts[0]!;
  }
  try {
    const res = await fetch(`${serviceUrl}/products/${id}`);
    if (!res.ok) {
      return mockProducts.find((p) => p.id === Number(id)) || mockProducts[0]!;
    }
    const data: ProductType = await res.json();
    return data && data.name
      ? data
      : mockProducts.find((p) => p.id === Number(id)) || mockProducts[0]!;
  } catch (error) {
    console.warn("Product service offline, using fallback:", error);
    return mockProducts.find((p) => p.id === Number(id)) || mockProducts[0]!;
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const product = await fetchProduct(id);
  return {
    title: product.name,
    describe: product.description,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const { size, color } = await searchParams;
  const { id } = await params;

  const product = await fetchProduct(id);

  const selectedSize = size || (product.sizes[0] as string);
  const selectedColor = color || (product.colors[0] as string);
  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={
            (product.images as Record<string, string>)?.[selectedColor] ||
            "/placeholder.svg"
          }
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>
      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">${product.price.toFixed(2)}</h2>
        <ProductInteraction
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
        {/* PAYMENT BADGES */}
        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-gray-700">
          <span className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded-md">Klarna.</span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md">Visa / MC</span>
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md">Stripe</span>
        </div>
        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
