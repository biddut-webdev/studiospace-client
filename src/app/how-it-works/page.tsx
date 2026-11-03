
import Link from "next/link";
import { Search, CalendarDays, CreditCard, Camera } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Spaces",
    description: "Explore creative studios and find the perfect space for your project.",
  },
  {
    icon: CalendarDays,
    title: "Select Your Hours",
    description: "Choose your preferred date and booking duration.",
  },
  {
    icon: CreditCard,
    title: "Book Your Studio",
    description: "Submit your booking request and wait for confirmation.",
  },
  {
    icon: Camera,
    title: "Create & Produce",
    description: "Visit your selected studio and bring your creative ideas to life.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 transition-colors duration-300 dark:bg-gray-950">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Simple Booking Process
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            How StudioSpace Works
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Find your ideal creative space and book it in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-solid border-gray-300 bg-white p-6 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Icon size={28} />
                </div>

                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  STEP 0{index + 1}
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h2>

                <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/studios"
            className="inline-flex rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Explore Studios
          </Link>
        </div>
      </section>
    </main>
  );
}
