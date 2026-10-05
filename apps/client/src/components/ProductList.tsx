import { ProductsType, ProductType } from "@repo/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";

// TEMPORARY
// const products: ProductsType = [
//   {
//     id: 1,
//     name: "Adidas CoreFit T-Shirt",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 39.9,
//     sizes: ["s", "m", "l", "xl", "xxl"],
//     colors: ["gray", "purple", "green"],
//     images: {
//       gray: "/products/1g.png",
//       purple: "/products/1p.png",
//       green: "/products/1gr.png",
//     },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 2,
//     name: "Puma Ultra Warm Zip",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["s", "m", "l", "xl"],
//     colors: ["gray", "green"],
//     images: { gray: "/products/2g.png", green: "/products/2gr.png" },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 3,
//     name: "Nike Air Essentials Pullover",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 69.9,
//     sizes: ["s", "m", "l"],
//     colors: ["green", "blue", "black"],
//     images: {
//       green: "/products/3gr.png",
//       blue: "/products/3b.png",
//       black: "/products/3bl.png",
//     },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 123,
//     name: "Nike Dri Flex T-Shirt",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 29.9,
//     sizes: ["s", "m", "l"],
//     colors: ["white", "pink"],
//     images: { white: "/products/4w.png", pink: "/products/4p.png" },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 5,
//     name: "Under Armour StormFleece",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 49.9,
//     sizes: ["s", "m", "l"],
//     colors: ["red", "orange", "black"],
//     images: {
//       red: "/products/5r.png",
//       orange: "/products/5o.png",
//       black: "/products/5bl.png",
//     },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 6,
  //   name: "Nike Air Max 270",
  //   shortDescription:
  //     "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
  //   description:
  //     "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
  //   price: 59.9,
  //   sizes: ["40", "42", "43", "44"],
  //   colors: ["gray", "white"],
  //   images: { gray: "/products/6g.png", white: "/products/6w.png" },
  //   categorySlug: "test",
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
//   {
//     id: 7,
//     name: "Nike Ultraboost Pulse ",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 69.9,
//     sizes: ["40", "42", "43"],
//     colors: ["gray", "pink"],
//     images: { gray: "/products/7g.png", pink: "/products/7p.png" },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 8,
//     name: "Levi’s Classic Denim",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["s", "m", "l"],
//     colors: ["blue", "green"],
//     images: { blue: "/products/8b.png", green: "/products/8gr.png" },
//     categorySlug: "test",
//     createdAt: new Date(),
//     updatedAt: new Date(),
import { mockProducts } from "@/lib/mockData";

const getFilteredMockProducts = ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  let list = [...mockProducts];
  if (category && category !== "all") {
    list = list.filter(
      (p) => p.categorySlug.toLowerCase() === category.toLowerCase()
    );
  }
  if (search) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (sort === "asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "oldest") {
    list.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } else {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  if (params === "homepage") {
    return list.slice(0, 8);
  }
  return list;
};

const fetchData = async ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const serviceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
  if (!serviceUrl) {
    return getFilteredMockProducts({ category, sort, search, params });
  }

  try {
    const res = await fetch(
      `${serviceUrl}/products?${category ? `category=${category}` : ""}${search ? `&search=${search}` : ""}&sort=${sort || "newest"}${params === "homepage" ? "&limit=8" : ""}`
    );
    if (!res.ok) {
      return getFilteredMockProducts({ category, sort, search, params });
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0
      ? data
      : getFilteredMockProducts({ category, sort, search, params });
  } catch (error) {
    console.warn("Product service offline or unreachable, using fallback:", error);
    return getFilteredMockProducts({ category, sort, search, params });
  }
};
const ProductList = async ({
  category,
  sort,
  search,
  params,
}: {
  category: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const products = await fetchData({ category, sort, search, params });
  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
        View all products
      </Link>
    </div>
  );
};

export default ProductList;
