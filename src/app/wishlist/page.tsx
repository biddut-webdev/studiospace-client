
"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type WishlistItem = {
  _id: string;
  studioId: string;
  studio: {
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
    location: string;
    hourlyRate: number;
    maxCapacity: number;
  };
};

const WishlistPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (isPending || !session) return;

    let isActive = true;

    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${serverUrl}/wishlist`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load wishlist");
        }

        if (isActive) {
          setWishlist(result.data || []);
        }
      } catch (error) {
        console.error("Wishlist error:", error);

        if (isActive) {
          toast.error("Could not load your wishlist.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      isActive = false;
    };
  }, [session, isPending, serverUrl]);

  const handleRemove = async (studioId: string) => {
    try {
      setRemovingId(studioId);

      const response = await fetch(
        `${serverUrl}/wishlist/${studioId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove studio");
      }

      setWishlist((previous) =>
        previous.filter((item) => item.studioId !== studioId)
      );

      toast.success("Studio removed from wishlist.");
    } catch (error) {
      console.error("Remove wishlist error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || (session && loading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-lime-500" size={36} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Heart size={48} className="mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold dark:text-white">
          Sign in to view your wishlist
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Save your favorite studios and find them here later.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 rounded-lg bg-lime-500 px-6 py-3 font-semibold text-black transition hover:bg-lime-400"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-lime-600">
            <Heart size={22} className="fill-current" />
            <span className="font-semibold">Your Collection</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Your favorite studios, saved in one place.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <Heart size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Explore studios and save the ones you love.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-block rounded-lg bg-lime-500 px-6 py-3 font-semibold text-black hover:bg-lime-400"
            >
              Explore Studios
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              {wishlist.length} saved{" "}
              {wishlist.length === 1 ? "studio" : "studios"}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => {
                const studio = item.studio;

                if (!studio) return null;

                return (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="relative h-56">
                      <Image
                        src={studio.imageUrl}
                        alt={studio.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />

                      <button
                        onClick={() => handleRemove(item.studioId)}
                        disabled={removingId === item.studioId}
                        aria-label="Remove from wishlist"
                        className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow transition hover:scale-110 disabled:opacity-50"
                      >
                        {removingId === item.studioId ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>

                    <div className="p-5">
                      <p className="text-sm font-medium text-lime-600">
                        {studio.category}
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                        {studio.title}
                      </h2>

                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {studio.location}
                      </p>

                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Up to {studio.maxCapacity} people
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ৳{studio.hourlyRate}
                          <span className="text-sm font-normal text-gray-500">
                            {" "}/ hour
                          </span>
                        </p>

                        <Link
                          href={`/studios/${studio._id}`}
                          className="rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
