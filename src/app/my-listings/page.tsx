
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { TStudio } from "@/types/studio";

const MyListingsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [studios, setStudios] = useState<TStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (isPending || !userEmail) return;

    const fetchMyStudios = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/my-studios`, {
          cache: "no-store",
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load studios");
        }

        setStudios(result.data || []);
      } catch (error) {
        console.error("Fetch My Studios Error:", error);
        toast.error("Could not load your studio listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudios();
  }, [userEmail, isPending]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const res = await fetch(`${SERVER_URL}/studios/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete studio");
      }

      setStudios((prev) => prev.filter((studio) => studio._id !== id));

      toast.success("Studio deleted successfully!");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7] dark:bg-gray-950">
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
          Sign in to manage your studio listings.
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

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-lime-700 dark:text-lime-400">
              Host Dashboard
            </p>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all the creative spaces you have listed.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-500"
          >
            <Plus size={18} />
            Add New Studio
          </Link>
        </div>

        {studios.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-[#e8e8df] bg-white px-5 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-10">
            {/* Decorative Background */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-100/60 blur-3xl dark:bg-lime-500/10" />

            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl dark:bg-orange-500/10" />

            <div className="relative mx-auto flex max-w-lg flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-lime-100 text-gray-950 dark:bg-lime-400/20 dark:text-lime-400">
                <Plus size={46} strokeWidth={1.5} />

                <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-gray-950 text-lime-300 dark:border-gray-900 dark:bg-lime-400 dark:text-gray-950">
                  <Sparkles size={16} />
                </span>
              </div>

              <span className="mt-8 rounded-full bg-lime-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:bg-lime-400/10 dark:text-lime-400">
                Start Your Hosting Journey
              </span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                No Studios Listed Yet!
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                You haven&apos;t listed any creative spaces yet.
                Share your studio with creators and turn your
                space into their next source of inspiration.
              </p>

              <Link
                href="/add-studio"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lime-500 hover:text-gray-950 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
              >
                <Plus size={18} />
                Add Your First Studio
              </Link>

              <p className="mt-6 text-xs font-medium text-gray-400 dark:text-gray-500">
                Your creative space deserves to be discovered.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-solid border-gray-300 bg-white shadow-sm transition hover:-translate-y-1 hover:border-lime-500 hover:shadow-lg dark:border-gray-600 dark:bg-gray-900 dark:hover:border-lime-500"
              >
                <div className="relative h-52">
                  <Image
                    src={studio.imageUrl}
                    alt={studio.title}
                    fill
                    className="object-cover"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {studio.title}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={15} />
                    {studio.location}
                  </p>

                  <p className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    ৳{studio.hourlyRate}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {" "}
                      / hour
                    </span>
                  </p>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => setSelectedStudioId(studio._id)}
                      disabled={deletingId === studio._id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {selectedStudioId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!deletingId) setSelectedStudioId(null);
            }}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Trash2 size={22} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Delete Studio?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this studio? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedStudioId(null)}
                  disabled={deletingId === selectedStudioId}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    const success = await handleDelete(selectedStudioId);

                    if (success) {
                      setSelectedStudioId(null);
                    }
                  }}
                  disabled={deletingId === selectedStudioId}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === selectedStudioId
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyListingsPage;
