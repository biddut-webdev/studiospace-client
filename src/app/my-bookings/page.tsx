
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { jsPDF } from "jspdf";
import {
  CalendarDays,
  Clock,
  MapPin,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkle,
  Download,
  FileText,
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

const MyBookingsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const userEmail = session?.user?.email;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch logged-in user's bookings
  useEffect(() => {
    if (isPending || !userEmail) return;

    let isActive = true;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${serverUrl}/bookings`, {
          cache: "no-store",
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load bookings");
        }

        if (isActive) {
          setBookings(result.data || []);
        }
      } catch (error) {
        console.error("Fetch Bookings Error:", error);

        if (isActive) {
          toast.error("Could not load your bookings.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isActive = false;
    };
  }, [userEmail, isPending, serverUrl]);

  // Generate and download booking invoice
  const handleDownloadInvoice = async (booking: Booking) => {
    try {
      setDownloadingId(booking._id);

      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();

      // Header background
      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, pageWidth, 55, "F");

      // Brand
      doc.setTextColor(163, 230, 53);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(25);
      doc.text("StudioSpace", 20, 25);

      // Header subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("CREATIVE SPACES. UNLIMITED POSSIBILITIES.", 20, 34);

      // Invoice title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("BOOKING INVOICE", 20, 75);

      // Invoice metadata
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(`Invoice Date: ${new Date().toLocaleDateString("en-GB")}`, 20, 87);
      doc.text(`Booking ID: ${booking._id}`, 20, 94);

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 103, pageWidth - 20, 103);

      // Customer details
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("CUSTOMER INFORMATION", 20, 118);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Name: ${booking.userName || "Customer"}`, 20, 128);
      doc.text(`Email: ${booking.userEmail}`, 20, 136);

      // Studio details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("STUDIO INFORMATION", 20, 155);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Studio: ${booking.studioTitle}`, 20, 165);
      doc.text(`Studio ID: ${booking.studioId}`, 20, 173);

      // Booking details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("BOOKING DETAILS", 20, 193);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Booking Date: ${booking.bookingDate}`, 20, 203);
      doc.text(`Start Time: ${booking.startTime}`, 20, 211);
      doc.text(
        `Duration: ${booking.duration} ${booking.duration === 1 ? "Hour" : "Hours"}`,
        20,
        219
      );
      doc.text(`Status: ${booking.status}`, 20, 227);

      // Amount section
      doc.setFillColor(244, 247, 235);
      doc.roundedRect(20, 245, pageWidth - 40, 35, 3, 3, "F");

      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("TOTAL AMOUNT", 28, 259);

      doc.setTextColor(101, 163, 13);
      doc.setFontSize(18);
      doc.text(
        `BDT ${Number(booking.totalPrice).toLocaleString("en-US")}`,
        pageWidth - 28,
        266,
        { align: "right" }
      );

      // Footer
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        "Thank you for choosing StudioSpace!",
        pageWidth / 2,
        290,
        { align: "center" }
      );

      doc.text(
        "This is a computer-generated booking invoice.",
        pageWidth / 2,
        296,
        { align: "center" }
      );

      const fileName = `StudioSpace-Invoice-${booking._id}.pdf`;
      doc.save(fileName);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice Download Error:", error);
      toast.error("Could not generate invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Cancel pending booking
  const handleCancelBooking = async (id: string) => {
    try {
      setCancellingId(id);

      const res = await fetch(`${serverUrl}/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: "Cancelled",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Could not cancel booking");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
      setConfirmCancelId(null);
    } catch (error) {
      console.error("Cancel Booking Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Booking status styles
  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";

      case "Confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";

      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Session Loading
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f5] dark:bg-gray-950">
        <Loader2
          className="animate-spin text-lime-600 dark:text-lime-400"
          size={32}
        />
      </div>
    );
  }

  // User Not Logged In
  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f8f5] px-4 dark:bg-gray-950">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <CalendarDays
            className="mx-auto text-lime-600 dark:text-lime-400"
            size={42}
          />

          <h1 className="mt-5 text-2xl font-bold text-gray-950 dark:text-white">
            Sign In Required
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Please sign in to view and manage your bookings.
          </p>

          <Link
            href="/signin"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-lime-400 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
          >
            Sign In
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f5] dark:bg-gray-950">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
            Your Creative Journey
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">
            My Bookings
          </h1>

          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Track and manage all your studio booking requests.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              className="animate-spin text-lime-600 dark:text-lime-400"
              size={32}
            />
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="relative overflow-hidden rounded-3xl border border-[#d9d9ce] bg-white px-5 py-20 text-center shadow-sm dark:border-gray-600 dark:bg-gray-900 sm:px-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-100/60 blur-3xl dark:bg-lime-500/10" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl dark:bg-orange-500/10" />

            <div className="relative mx-auto flex max-w-lg flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-lime-100 text-gray-900 dark:bg-lime-400/20 dark:text-lime-400">
                <CalendarDays size={42} strokeWidth={1.5} />

                <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-gray-950 text-lime-300 dark:border-gray-900 dark:bg-lime-400 dark:text-gray-950">
                  <Sparkle size={16} />
                </span>
              </div>

              <span className="mt-8 rounded-full bg-lime-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:bg-lime-400/10 dark:text-lime-400">
                Your Journey Starts Here
              </span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                No Bookings Yet!
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                You haven&apos;t booked any creative spaces yet.
                Discover inspiring studios and find the perfect
                space for your next creative project.
              </p>

              <Link
                href="/studios"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lime-500 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
              >
                Explore Studios
                <ArrowRight size={18} />
              </Link>

              <p className="mt-6 text-xs font-medium text-gray-400 dark:text-gray-500">
                Your next creative experience is waiting.
              </p>
            </div>
          </div>
        ) : (
          /* Booking List */
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-solid border-gray-400 bg-white shadow-md dark:!border-white/40 dark:bg-gray-900"
              >
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                  {/* Studio Image */}
                  <div className="relative h-56 md:h-full">
                    <Image
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Information */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>

                        <h2 className="mt-3 text-xl font-bold text-gray-950 dark:text-white">
                          {booking.studioTitle}
                        </h2>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
                          ৳{booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CalendarDays
                          size={18}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        {booking.bookingDate}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Clock
                          size={18}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        {booking.startTime}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Clock
                          size={18}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        {booking.duration}{" "}
                        {booking.duration === 1 ? "Hour" : "Hours"}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin
                          size={18}
                          className="text-lime-600 dark:text-lime-400"
                        />
                        Studio Booking
                      </div>
                    </div>

                    {/* Confirmed Booking Invoice */}
                    {booking.status === "Confirmed" && (
                      <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-600">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(booking)}
                          disabled={downloadingId === booking._id}
                          className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {downloadingId === booking._id ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Download size={17} />
                          )}

                          {downloadingId === booking._id
                            ? "Generating Invoice..."
                            : "Download Invoice"}
                        </button>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <FileText size={13} />
                          Download your confirmed booking receipt.
                        </p>
                      </div>
                    )}

                    {/* Cancel Confirmation */}
                    {booking.status === "Pending" && (
                      <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-600">
                        {confirmCancelId === booking._id ? (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Are you sure you want to cancel this booking?
                            </p>

                            <div className="flex gap-3">
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                disabled={cancellingId === booking._id}
                                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                              >
                                Keep Booking
                              </button>

                              <button
                                onClick={() =>
                                  handleCancelBooking(booking._id)
                                }
                                disabled={cancellingId === booking._id}
                                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                              >
                                {cancellingId === booking._id
                                  ? "Cancelling..."
                                  : "Yes, Cancel"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmCancelId(booking._id)
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <XCircle size={17} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyBookingsPage;
