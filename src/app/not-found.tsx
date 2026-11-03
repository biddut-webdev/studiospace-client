
import Link from "next/link";
import {
  Aperture,
  ArrowLeft,
  Camera,
  Clapperboard,
  Mic2,
  Sparkles,
} from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#faf9f6] px-5 py-16 transition-colors duration-300 dark:bg-gray-950">
      {/* Background decorations */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Illustration */}
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          <div className="absolute inset-8 rounded-full border border-dashed border-[#c9c2b5] dark:border-gray-700" />
          <div className="absolute inset-14 rounded-full border border-[#ded8cc] dark:border-gray-700" />

          <div className="relative flex h-64 w-64 rotate-[-8deg] items-center justify-center rounded-[3rem] bg-[#20201e] shadow-2xl shadow-black/20">
            <Aperture
              size={145}
              strokeWidth={1.1}
              className="text-[#f5b96c]"
            />

            <div className="absolute -right-5 -top-5 flex h-16 w-16 rotate-[15deg] items-center justify-center rounded-2xl bg-[#f5b96c] text-[#20201e] shadow-lg">
              <Camera size={30} />
            </div>

            <div className="absolute -bottom-5 -left-5 flex h-16 w-16 rotate-[12deg] items-center justify-center rounded-2xl bg-white text-[#20201e] shadow-lg">
              <Mic2 size={28} />
            </div>
          </div>

          <div className="absolute right-4 top-12 rounded-full bg-white p-3 shadow-md dark:bg-gray-800">
            <Sparkles className="text-orange-500" size={23} />
          </div>

          <div className="absolute bottom-12 left-2 rounded-full bg-white p-3 shadow-md dark:bg-gray-800">
            <Clapperboard className="text-indigo-600 dark:text-indigo-400" size={23} />
          </div>

          <span className="absolute bottom-2 right-8 text-xs font-bold tracking-[0.3em] text-[#a49b8d] dark:text-gray-500">
            LOST IN CREATIVITY
          </span>
        </div>

        {/* Content */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Error 404
          </div>

          <h1 className="mt-6 text-7xl font-black tracking-tight text-[#22211f] dark:text-white sm:text-8xl">
            Oops<span className="text-orange-500">!</span>
          </h1>

          <h2 className="mt-3 text-2xl font-bold leading-snug text-[#34322e] dark:text-gray-200 sm:text-3xl">
            This space is out of frame.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-base leading-8 text-[#777168] dark:text-gray-400 md:mx-0">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back to discovering amazing creative spaces.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22211f] px-7 py-4 font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:bg-orange-500"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <Link
              href="/studios"
              className="inline-flex items-center justify-center rounded-xl border border-[#d8d2c7] bg-white px-7 py-4 font-semibold text-[#34322e] transition hover:border-orange-400 hover:bg-orange-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-orange-500 dark:hover:bg-gray-800"
            >
              Explore Studios
            </Link>
          </div>

          <p className="mt-10 text-sm font-medium text-[#a49b8d] dark:text-gray-500">
            StudioSpace — Find your creative space.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
