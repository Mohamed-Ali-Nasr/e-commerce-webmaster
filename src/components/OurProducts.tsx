import {
  HiOutlineArrowSmallRight,
  HiOutlineArrowSmallLeft,
} from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { NavigationOptions } from "swiper/types";
import { useAppSelector } from "@/store/redux-hooks";
import { selectCart } from "@/store/cart/cartSlice";
import { useGetAllProductsQuery } from "@/store/cart/cartApi";
import Loader from "./Loader";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { IProduct } from "@/types";
import { getRandomItems } from "@/utils";

const OurProducts = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { products } = useAppSelector(selectCart);

  const { isError: productsError, isLoading: productsLoading } =
    useGetAllProductsQuery();

  const [combinedData, setCombinedData] = useState<IProduct[]>([]);

  useEffect(() => {
    const randomSelection = getRandomItems(products, 10);

    const combined = [
      ...products.map((item) => ({ ...item, isNew: false })),
      ...randomSelection,
    ];

    // Filter out duplicates and prioritize new items
    const uniqueArray = combined.reduce((acc: IProduct[], current) => {
      const existing = acc.find((item) => item.id === current.id);
      if (!existing) {
        acc.push(current);
      } else if (current.isNew) {
        acc = acc.map((item) => (item.id === current.id ? current : item));
      }
      return acc;
    }, []);

    setCombinedData(uniqueArray);
  }, [products]);

  if (productsLoading || !combinedData || combinedData.length === 0) {
    return <Loader />;
  }

  return (
    <section className="py-8 px-6">
      <div className="flex items-center gap-4 my-6">
        <div className="bg-[#DB4444] w-5 h-10 rounded-sm"></div>
        <p className="text-[20px] font-semibold text-[#DB4444]">Our Products</p>
      </div>

      <div className="flex md:flex-row flex-col gap-12 md:gap-4 md:items-center md:justify-between mb-16">
        <p className="text-5xl font-medium">Explore Our Products</p>

        {swiper && (
          <div className="flex items-center gap-4">
            <button
              ref={nextRef}
              onClick={() => swiper.slideNext()}
              className="cursor-pointer p-3 bg-gray-100 rounded-full"
            >
              <HiOutlineArrowSmallLeft size={28} />
            </button>
            <button
              ref={prevRef}
              onClick={() => swiper.slidePrev()}
              className="cursor-pointer p-3 bg-gray-100 rounded-full"
            >
              <HiOutlineArrowSmallRight size={28} />
            </button>
          </div>
        )}
      </div>

      {productsError && (
        <p className="my-12 text-4xl font-semibold text-red-500">
          Something Wrong happened, Please Try again Later ...
        </p>
      )}

      {combinedData.length > 0 && (
        <Swiper
          modules={[Navigation, Grid]}
          loop={true}
          spaceBetween={35}
          slidesPerView={1}
          grid={{
            rows: 2,
            fill: "row",
          }}
          onSwiper={(swiper) => {
            setSwiper(swiper);
            if (swiper.params.navigation) {
              (swiper.params.navigation as NavigationOptions).prevEl =
                prevRef.current;
              (swiper.params.navigation as NavigationOptions).nextEl =
                nextRef.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            // Responsive breakpoints
            768: {
              slidesPerView: 2,
              grid: { rows: 2, fill: "row" },
            },
            1024: {
              slidesPerView: 3,
              grid: { rows: 2, fill: "row" },
            },
            1280: {
              slidesPerView: 4,
              grid: { rows: 2, fill: "row" },
            },
          }}
          className="h-[1000px]"
        >
          {combinedData.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductItem product={product} explore />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Link to="/products" className="block w-fit mx-auto mb-15">
        <button className="hover:bg-red-700 transition-all duration-300 cursor-pointer mt-15 mx-auto block bg-[#DB4444] text-[18px] font-medium text-white md:px-20 px-10 md:py-5 py-3 rounded-md">
          View All Products
        </button>
      </Link>
    </section>
  );
};

export default OurProducts;
