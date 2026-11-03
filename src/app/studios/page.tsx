
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Users,
  ArrowUpRight,
  ArrowRight,
  SearchX,
  Sparkles,
} from "lucide-react";
import { TStudio } from "@/types/studio";

const categories = [
  "All Studios",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const StudiosPage = async ({ searchParams }: Props) => {
  const { category } = await searchParams;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/studios`,
    { cache: "no-store" }
  );

  const result = await res.json();

  const studios: TStudio[] = result.data || [];

  const filteredStudios =
    category && category !== "All Studios"
      ? studios.filter((studio) => studio.category === category)
      : studios;

  return (
    <main className="min-h-screen bg-[#f8f8f5] dark:bg-gray-950">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">

        {/* Page Heading */}
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
            Find Your Creative Space
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">
            Explore Studios
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            Discover inspiring spaces designed to bring your creative
            ideas to life.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((item) => {
            const isActive =
              item === "All Studios"
                ? !category || category === "All Studios"
                : category === item;

            const href =
              item === "All Studios"
                ? "/studios"
                : `/studios?category=${encodeURIComponent(item)}`;

            return (
              <Link
                key={item}
                href={href}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${isActive
                  ? "bg-gray-950 text-white dark:bg-lime-500 dark:text-gray-950"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-lime-400 hover:text-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-lime-500 dark:hover:text-white"
                  }`}
              >
                {item}
              </Link>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-950 dark:text-white">
              {filteredStudios.length}
            </span>{" "}
            studios
          </p>
        </div>

        {/* Studio Grid */}
        {filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/${studio._id}`}
                className="group overflow-hidden rounded-2xl border border-solid border-gray-300 bg-white transition duration-300 hover:-translate-y-1 hover:border-lime-500 hover:shadow-xl dark:border-gray-600 dark:bg-gray-900 dark:hover:border-lime-500"
              >
                {/* Studio Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={studio.imageUrl}
                    alt={studio.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-gray-900">
                    {studio.category}
                  </span>

                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-950">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                {/* Studio Information */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-950 transition group-hover:text-lime-600 dark:text-white dark:group-hover:text-lime-400">
                    {studio.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={16} />
                    {studio.location}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users size={16} />
                      Up to {studio.maxCapacity} people
                    </div>

                    <p className="font-bold text-gray-950 dark:text-white">
                      ৳{studio.hourlyRate}
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                        /hr
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (

          /* Empty State */
          <div className="relative overflow-hidden rounded-3xl border border-[#e8e8df] bg-white px-5 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-10">

            {/* Decorative Background */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-100/60 blur-3xl dark:bg-lime-900/20" />

            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl dark:bg-orange-900/10" />

            <div className="relative mx-auto flex max-w-lg flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-lime-100 text-gray-900 shadow-inner dark:bg-lime-950 dark:text-lime-400">
                <SearchX size={42} strokeWidth={1.5} />

                <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-gray-950 text-lime-300 dark:border-gray-900 dark:bg-lime-500 dark:text-gray-950">
                  <Sparkles size={16} />
                </span>
              </div>

              <span className="mt-8 rounded-full bg-lime-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:bg-lime-950 dark:text-lime-400">
                No results found
              </span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                No studios in this category yet!
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                We couldn&apos;t find any creative spaces matching this category.
                Try exploring other categories to discover your perfect space.
              </p>

              <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/studios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lime-500 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
                >
                  Explore All Studios
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-lime-400 hover:bg-lime-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-lime-500 dark:hover:bg-gray-700"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default StudiosPage;
