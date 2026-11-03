
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  startTime: string;
  duration: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
};

const HostBookingsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/host-bookings`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch bookings");
        }

        setBookings(result.data);
      } catch (error) {
        console.error("Host bookings error:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, isPending]);

  const updateBookingStatus = async (
    id: string,
    status: "Confirmed" | "Cancelled" | "Completed"
  ) => {
    setUpdatingId(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/host-bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update booking");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );

      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Booking update error:", error);
      toast.error("Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || (loading && !!session?.user?.email)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f9f5] dark:bg-gray-950">
        <Loader2
          className="animate-spin text-lime-600 dark:text-lime-400"
          size={35}
        />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f8f9f5] px-4 text-center dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please Sign In
        </h2>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Sign in to manage bookings for your studios.
        </p>

        <Link
          href="/signin"
          className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-lime-400 hover:text-black dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9f5] px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <p className="font-semibold uppercase tracking-[0.2em] text-lime-700 dark:text-lime-400">
            Host Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Host Bookings
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Manage reservations made for your creative spaces.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-gray-800 dark:bg-gray-900">
            <CalendarDays
              className="mx-auto text-gray-400 dark:text-gray-500"
              size={45}
            />

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              No Bookings Yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Bookings for your studios will appear here.
            </p>

            <Link
              href="/my-listings"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-lime-400 hover:text-black dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
            >
              View My Studios
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-solid border-gray-300 bg-white shadow-sm transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900"
              >
                <div className="grid md:grid-cols-[220px_1fr]">
                  {/* Studio Image */}
                  <div className="relative min-h-[200px]">
                    <Image
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Information */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-lime-700 dark:text-lime-400">
                          {booking.studioTitle}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                          {booking.userName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {booking.userEmail}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold ${booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300"
                          : booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                            : booking.status === "Completed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="mt-6 grid gap-4 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <CalendarDays
                          size={17}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        {booking.bookingDate}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock
                          size={17}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        {booking.startTime} · {booking.duration} hour(s)
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        Studio ID: {booking.studioId.slice(-6)}
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ৳{booking.totalPrice.toLocaleString("en-BD")}
                      </p>

                      {booking.status === "Pending" && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "Confirmed")
                            }
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-700 disabled:opacity-50"
                          >
                            {updatingId === booking._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            Confirm
                          </button>

                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "Cancelled")
                            }
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        </div>
                      )}

                      {booking.status === "Confirmed" && (
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "Completed")
                          }
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updatingId === booking._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HostBookingsPage;
