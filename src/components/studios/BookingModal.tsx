
"use client";

import { useState } from "react";
import { CalendarDays, Clock, X, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { TStudio } from "@/types/studio";
import { toast } from "sonner";

type Props = {
  studio: TStudio;
};

const BookingModal = ({ studio }: Props) => {
  const { data: session } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = studio.hourlyRate * duration;

  const today = new Date().toLocaleDateString("en-CA");

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to book a studio.");
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      studioId: studio._id,
      studioTitle: studio.title,
      studioImage: studio.imageUrl,
      userName: session.user.name,
      userEmail: session.user.email,
      bookingDate,
      startTime,
      duration,
      totalPrice,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bookingData),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Booking failed!");
      }

      toast.success("Your booking request has been submitted!");

      setIsOpen(false);
      setBookingDate("");
      setStartTime("");
      setDuration(1);
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Book Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-4 font-semibold text-white transition hover:bg-lime-400 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
      >
        Book This Studio
        <ArrowRight size={18} />
      </button>

      {/* Booking Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white sm:p-8">

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Close booking modal"
            >
              <X size={20} />
            </button>

            {/* Modal Heading */}
            <p className="text-sm font-semibold uppercase tracking-widest text-lime-600 dark:text-lime-400">
              StudioSpace Booking
            </p>

            <h2 className="mt-2 pr-8 text-2xl font-bold text-gray-950 dark:text-white">
              Book Your Studio
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Select your preferred date and time to request a booking.
            </p>

            {/* Studio Information */}
            <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-950 dark:text-white">
                {studio.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {studio.location}
              </p>

              <p className="mt-2 font-bold text-gray-950 dark:text-white">
                ৳{studio.hourlyRate}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {" "}/ hour
                </span>
              </p>
            </div>

            {!session?.user ? (
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                Please sign in to your account before booking this studio.

                <a
                  href="/signin"
                  className="ml-1 font-bold underline"
                >
                  Sign In
                </a>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="mt-6 space-y-5">

                {/* Booking Date */}
                <div>
                  <label
                    htmlFor="bookingDate"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Booking Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="bookingDate"
                      type="date"
                      min={today}
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Start Time
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="startTime"
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Duration (Hours)
                  </label>

                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((hour) => (
                      <option
                        key={hour}
                        value={hour}
                        className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                      >
                        {hour} {hour === 1 ? "Hour" : "Hours"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Summary */}
                <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5 dark:border-lime-900 dark:bg-lime-950/40">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>
                      ৳{studio.hourlyRate} × {duration} hours
                    </span>

                    <span>৳{totalPrice}</span>
                  </div>

                  <div className="my-3 border-t border-lime-200 dark:border-lime-900" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-950 dark:text-white">
                      Total Price
                    </span>

                    <span className="text-2xl font-bold text-gray-950 dark:text-white">
                      ৳{totalPrice}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-full bg-gray-950 px-6 py-4 font-semibold text-white transition hover:bg-lime-400 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingModal;
