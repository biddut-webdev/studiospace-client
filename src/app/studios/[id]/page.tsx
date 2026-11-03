
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { TStudio } from "@/types/studio";
import BookingModal from "@/components/studios/BookingModal";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const StudioDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  let studio: TStudio;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/studios/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      notFound();
    }

    const result = await res.json();

    if (!result.data) {
      notFound();
    }

    studio = result.data;
  } catch {
    notFound();
  }

  const cardClass =
    "rounded-2xl border border-solid border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900";

  const infoCardClass =
    "flex items-center gap-4 rounded-2xl border border-solid border-gray-300 bg-white p-5 transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900";

  return (
    <main className="min-h-screen bg-[#f8f8f5] transition-colors duration-300 dark:bg-gray-950">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Back Button */}
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-lime-600 dark:text-gray-300 dark:hover:text-lime-400"
        >
          <ArrowLeft size={18} />
          Back to Studios
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <span className="rounded-full bg-lime-100 px-4 py-2 text-xs font-semibold text-lime-800 dark:bg-lime-950 dark:text-lime-400">
            {studio.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">
            {studio.title}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <MapPin size={18} />
            {studio.location}
          </p>
        </div>

        {/* Gallery */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[studio.imageUrl, ...(studio.images || [])].map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-[300px] min-w-[85%] overflow-hidden rounded-3xl border border-solid border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800 sm:h-[450px] sm:min-w-[70%] lg:min-w-[60%]"
            >
              <Image
                src={image}
                alt={`${studio.title} - Image ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Details Layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-10 lg:col-span-2">
            {/* Studio Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                About This Space
              </h2>

              <p className="mt-4 leading-8 text-gray-600 dark:text-gray-400">
                {studio.overview}
              </p>
            </div>

            {/* Studio Information */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">
                Studio Information
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Maximum Capacity */}
                <div className={infoCardClass}>
                  <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-lime-950 dark:text-lime-400">
                    <Users size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Maximum Capacity
                    </p>

                    <p className="font-semibold text-gray-950 dark:text-white">
                      {studio.maxCapacity} People
                    </p>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className={infoCardClass}>
                  <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-lime-950 dark:text-lime-400">
                    <Clock size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hourly Rate
                    </p>

                    <p className="font-semibold text-gray-950 dark:text-white">
                      ৳{studio.hourlyRate} / hour
                    </p>
                  </div>
                </div>

                {/* Security Deposit */}
                <div className={infoCardClass}>
                  <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-lime-950 dark:text-lime-400">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Security Deposit
                    </p>

                    <p className="font-semibold text-gray-950 dark:text-white">
                      ৳{studio.securityDeposit}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className={infoCardClass}>
                  <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-lime-950 dark:text-lime-400">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>

                    <p className="font-semibold text-gray-950 dark:text-white">
                      {studio.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">
                What This Studio Offers
              </h2>

              {studio.amenities?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {studio.amenities.map((amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-lime-600 dark:text-lime-400"
                      />
                      {amenity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No amenities information available.
                </p>
              )}
            </div>

            {/* Host Information */}
            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                Hosted By
              </h2>

              <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                {studio.hostName}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {studio.hostEmail}
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">
                Reviews
              </h2>

              {studio.reviews?.length ? (
                <div className="space-y-4">
                  {studio.reviews.map((review) => (
                    <div
                      key={review._id}
                      className={`${cardClass} p-5`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {review.userName}
                        </h3>

                        <span className="text-sm font-medium text-lime-700 dark:text-lime-400">
                          ★ {review.rating}/5
                        </span>
                      </div>

                      <p className="mt-3 text-gray-600 dark:text-gray-400">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${cardClass} p-5 text-gray-500 dark:text-gray-400`}>
                  No reviews yet.
                </p>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <aside>
            <div
              className={`sticky top-24 ${cardClass} p-6 shadow-sm`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Starting from
              </p>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-950 dark:text-white">
                  ৳{studio.hourlyRate}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / hour
                </span>
              </div>

              <div className="my-6 border-t border-gray-300 dark:border-gray-700" />

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Security Deposit</span>

                  <span className="font-semibold text-gray-950 dark:text-white">
                    ৳{studio.securityDeposit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Maximum Capacity</span>

                  <span className="font-semibold text-gray-950 dark:text-white">
                    {studio.maxCapacity} People
                  </span>
                </div>
              </div>

              <BookingModal studio={studio} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default StudioDetailsPage;
