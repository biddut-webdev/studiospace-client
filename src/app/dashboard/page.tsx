
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Plus,
  Store,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  status: string;
};

const DashboardPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [studioCount, setStudioCount] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (isPending || !userEmail) return;

    const fetchDashboardData = async () => {
      try {
        const [studioRes, bookingRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-studios`, {
            cache: "no-store",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/host-bookings`, {
            cache: "no-store",
            credentials: "include",
          }),
        ]);

        const [studioResult, bookingResult] = await Promise.all([
          studioRes.json(),
          bookingRes.json(),
        ]);

        if (!studioRes.ok || !studioResult.success) {
          throw new Error(
            `Studio API Error: ${studioResult.message || studioRes.status}`
          );
        }

        if (!bookingRes.ok || !bookingResult.success) {
          throw new Error(
            `Booking API Error: ${bookingResult.message || bookingRes.status}`
          );
        }

        setStudioCount(studioResult.data?.length || 0);
        setBookings(bookingResult.data || []);
      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error("Could not load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userEmail, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fafaf7] dark:bg-gray-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-lime-500 dark:border-gray-700 dark:border-t-lime-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafaf7] px-4 text-center dark:bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please Sign In
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Sign in to access your dashboard.
        </p>

        <Link
          href="/signin"
          className="rounded-full bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-500"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const stats = [
    {
      title: "Total Studios",
      value: studioCount,
      icon: Store,
      color:
        "bg-lime-100 text-lime-700 dark:bg-lime-400/15 dark:text-lime-400",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-400",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-400",
    },
  ];

  const actions = [
    {
      title: "Add New Studio",
      description: "Share a new creative space.",
      href: "/add-studio",
      icon: Plus,
    },
    {
      title: "My Studio Listings",
      description: "Manage your studio listings.",
      href: "/my-listings",
      icon: Store,
    },
    {
      title: "My Bookings",
      description: "View your booking history.",
      href: "/my-bookings",
      icon: ListChecks,
    },
    {
      title: "Host Bookings",
      description: "Manage bookings made for your studios.",
      href: "/host-bookings",
      icon: CalendarDays,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-14 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[3px] text-lime-700 dark:text-lime-400">
            <LayoutDashboard size={17} />
            Host Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Welcome back, {session.user.name}!
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Manage your creative spaces and keep track of your bookings.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-4 ${stat.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-gray-300 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-lime-500"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-lime-100 p-3 text-lime-700 dark:bg-lime-400/15 dark:text-lime-400">
                      <Icon size={23} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black dark:text-gray-500 dark:group-hover:text-lime-400"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
