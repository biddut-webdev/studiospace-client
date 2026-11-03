import { TStudio } from "@/types/studio";
import StudioCard from "./StudioCard";
import Link from "next/link";

const FeaturedStudios = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/featured-studios`,
    {
      cache: "no-store",
    }
  );

  const result = await res.json();
  const studios: TStudio[] = result.data.slice(0, 6);

  return (
    <section className="bg-white px-4 py-20 transition-colors duration-300 dark:bg-gray-800 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-lime-600">
              Explore Spaces
            </p>

            <h2 className="text-3xl font-bold text-gray-950 transition-colors dark:text-white sm:text-4xl">
              Featured Studios
            </h2>

            <p className="mt-3 max-w-xl text-gray-500 dark:text-gray-400">
              Discover inspiring spaces designed to bring your creative ideas to life.
            </p>
          </div>

          <Link
            href="/studios"
            className="w-fit rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-lime-600 dark:hover:text-white"
          >
            Explore All Studios →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStudios;