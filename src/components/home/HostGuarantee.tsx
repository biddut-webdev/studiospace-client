import {
  ShieldCheck,
  Headset,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const guarantees = [
  "Transparent pricing with no hidden surprises",
  "Detailed studio information and amenities",
  "Reliable booking request management",
];

const supportFeatures = [
  "Spaces for every type of creative project",
  "Simple and convenient booking experience",
  "Support throughout your creative journey",
];

const HostGuarantee = () => {
  return (
    <section className="bg-gray-50 px-4 py-24 transition-colors duration-300 dark:bg-gray-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-lime-600">
            Create With Confidence
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
            Your Creativity Deserves
            <span className="block text-lime-600">The Right Space</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
            We make finding and booking creative spaces simple,
            transparent, and convenient so you can focus on what matters most.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {/* Host Guarantee */}
          <div className="group rounded-3xl bg-gray-950 p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-gray-950">
                <ShieldCheck size={32} />
              </div>

              <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-300">
                Trusted Spaces
              </span>
            </div>

            <h3 className="text-2xl font-bold sm:text-3xl">
              Host Guarantee
            </h3>

            <p className="mt-4 max-w-md leading-7 text-gray-400">
              Find your next creative space with clear information,
              transparent pricing, and a straightforward booking process.
            </p>

            <div className="mt-8 space-y-4">
              {guarantees.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-lime-400"
                  />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>

            <Link
              href="/studios"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-lime-400 transition hover:gap-4"
            >
              Explore Studios
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* Creator Support */}
          <div className="group rounded-3xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-lime-200 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-lime-800 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 text-gray-950">
                <Headset size={32} />
              </div>

              <span className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Creator First
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-950 dark:text-white sm:text-3xl">
              Creator Support
            </h3>

            <p className="mt-4 max-w-md leading-7 text-gray-500 dark:text-gray-400">
              Whether you&apos;re a photographer, musician, filmmaker,
              or artist, discover spaces that help bring your vision to life.
            </p>

            <div className="mt-8 space-y-4">
              {supportFeatures.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-lime-600"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/studios"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-gray-950 transition hover:gap-4 hover:text-lime-600 dark:text-white dark:hover:text-lime-400"
            >
              Find Your Space
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostGuarantee;