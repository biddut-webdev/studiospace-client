
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "/images/hero.jpg",
    alt: "Creative photography studio",
    badge: "Spaces that inspire creativity",
    title: "Find Your Space.",
    highlight: "Create Your Vision.",
    description:
      "Discover and book inspiring photography studios. Find the perfect space to bring your creative ideas to life.",
  },
  {
    image: "/images/hero2.jpg",
    alt: "Professional music recording studio",
    badge: "Make every sound count",
    title: "Create Your Sound.",
    highlight: "Record Your Story.",
    description:
      "Explore professional music suites and recording spaces designed to bring your sound and creativity to life.",
  },
  {
    image: "/images/hero3.jpg",
    alt: "Creative art workshop",
    badge: "Your creativity deserves space",
    title: "Dream Big.",
    highlight: "Create Without Limits.",
    description:
      "Discover inspiring art workshops and creative spaces where your imagination can become reality.",
  },
];

const HeroSection = () => {
  return (
    <section className="px-4 py-5 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-3xl border-2 border-gray-500 bg-gray-900 shadow-xl">

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop={true}
          speed={900}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            prevEl: ".hero-prev",
            nextEl: ".hero-next",
          }}
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.image}>
              <div className="relative min-h-[650px]">

                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/55" />

                {/* Hero Content */}
                <div className="relative z-10 flex min-h-[650px] items-center px-6 py-20 sm:px-12 lg:px-16">
                  <div className="max-w-4xl text-white">

                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                      <Sparkles size={16} className="text-lime-300" />
                      {slide.badge}
                    </div>

                    <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                      {slide.title}
                      <br />
                      <span className="text-lime-300">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-9 flex flex-wrap gap-4">
                      <Link
                        href="/studios"
                        className="group inline-flex items-center gap-3 rounded-full bg-lime-400 px-7 py-4 font-semibold text-gray-950 transition hover:bg-lime-300"
                      >
                        Explore Studios
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="/add-studio"
                        className="rounded-full border border-white/60 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-gray-950"
                      >
                        Host Your Space
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Previous Button */}
        <button
          className="hero-prev absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-lime-400 hover:text-black sm:left-6"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Button */}
        <button
          className="hero-next absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-lime-400 hover:text-black sm:right-6"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

      </div>


    </section>
  );
};

export default HeroSection;
