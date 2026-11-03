import Link from "next/link";
import {
  Search,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover a Studio",
    description:
      "Explore a wide range of creative spaces and find the perfect studio for your project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Time",
    description:
      "Select your preferred date, time, and duration that perfectly fits your schedule.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Confirm Booking",
    description:
      "Send your booking request and wait for the studio host to confirm your reservation.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Create Something Amazing",
    description:
      "Show up, bring your creativity, and turn your ideas into something extraordinary.",
    icon: Sparkles,
  },
];

const HowBookingWorks = () => {
  return (
    <section className="bg-white px-4 py-24 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-lime-600">
            Simple & Easy Process
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
            How Booking Works
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
            Booking your perfect creative space has never been easier.
            Just follow these four simple steps and get ready to create.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-gray-100 bg-gray-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-lime-200 hover:bg-white hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-lime-700 dark:hover:bg-gray-800"
              >
                {/* Number */}
                <div className="mb-7 flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-lime-600">
                    STEP {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-gray-950 transition duration-300 group-hover:rotate-6 group-hover:bg-lime-400">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-gray-950 dark:text-white">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-7 h-1 w-12 rounded-full bg-lime-400 transition-all duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-gray-600 dark:text-gray-400">
            Ready to find your perfect creative space?
          </p>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-lime-400 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
          >
            Explore Studios
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowBookingWorks;