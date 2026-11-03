import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    image:
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1200&q=80",
    count: "Photography & Shoots",
  },
  {
    name: "Sound Stages",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=80",
    count: "Film & Video Production",
  },
  {
    name: "Podcast Rooms",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    count: "Audio & Podcasting",
  },
  {
    name: "Music Suites",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    count: "Music & Recording",
  },
  {
    name: "Art Workshops",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    count: "Art & Creativity",
  },
];

const StudioCategories = () => {
  return (
    <section className="bg-gray-50 px-4 py-20 transition-colors duration-300 dark:bg-gray-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-lime-600">
            Find Your Creative Space
          </p>

          <h2 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
            Explore By Category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-500 dark:text-gray-400">
            From photography to music production, find the perfect space to
            bring your creative ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              className="group relative h-72 overflow-hidden rounded-2xl"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                <div>
                  <p className="mb-2 text-sm text-gray-300">
                    {category.count}
                  </p>

                  <h3 className="text-2xl font-bold">
                    {category.name}
                  </h3>
                </div>

                <div className="rounded-full bg-lime-400 p-3 text-gray-950 transition group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioCategories;