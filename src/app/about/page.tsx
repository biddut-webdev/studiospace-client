
import Link from "next/link";
import { Aperture, Users, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 transition-colors duration-300 dark:bg-gray-950">
      <section className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Aperture size={34} />
        </div>

        <p className="mt-6 font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          About StudioSpace
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          A Space for Every Creative Idea
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          StudioSpace is a creative workspace marketplace that connects
          studio owners with photographers, filmmakers, podcasters,
          musicians, and other creators. Our goal is to make discovering
          and booking creative spaces simple and convenient.
        </p>

        <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
            <Users className="text-indigo-600 dark:text-indigo-400" size={30} />

            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Our Community
            </h2>

            <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
              We connect creative people with workspace owners through one platform.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
            <Lightbulb className="text-indigo-600 dark:text-indigo-400" size={30} />

            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Our Mission
            </h2>

            <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
              We aim to make creative spaces easier to discover and reserve.
            </p>
          </div>
        </div>

        <Link
          href="/studios"
          className="mt-10 inline-flex rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Explore Studios
        </Link>
      </section>
    </main>
  );
}
