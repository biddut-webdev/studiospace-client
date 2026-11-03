
"use client";

import Image from "next/image";
import { Heart, MapPin, Star, Users } from "lucide-react";
import { TStudio } from "@/types/studio";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Props = {
  studio: TStudio;
};

const StudioCard = ({ studio }: Props) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Check whether this studio is already in wishlist
  useEffect(() => {
    if (isPending || !session?.user) return;

    const checkWishlist = async () => {
      try {
        const response = await fetch(`${serverUrl}/wishlist`, {
          credentials: "include",
        });

        if (!response.ok) return;

        const result = await response.json();

        const exists = result.data?.some(
          (item: { studioId: string }) =>
            item.studioId === String(studio._id)
        );

        setIsWishlisted(Boolean(exists));
      } catch (error) {
        console.error("Wishlist Check Error:", error);
      }
    };

    checkWishlist();
  }, [session, isPending, serverUrl, studio._id]);

  // Add or remove studio from wishlist
  const handleWishlist = async () => {
    if (!session?.user) {
      toast.error("Please login to save your favorite studios.");
      router.push("/signin");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isWishlisted) {
        const response = await fetch(
          `${serverUrl}/wishlist/${studio._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to remove from wishlist");
        }

        setIsWishlisted(false);
        toast.success("Studio removed from wishlist");
      } else {
        const response = await fetch(`${serverUrl}/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            studioId: String(studio._id),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to add to wishlist");
        }

        setIsWishlisted(true);
        toast.success("Studio added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-lime-500 hover:shadow-xl dark:border-gray-600 dark:bg-gray-900 dark:hover:border-lime-500">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleWishlist}
          disabled={isLoading || isPending}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900"
        >
          <Heart
            size={21}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-700 dark:text-gray-200"
            }
          />
        </button>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-lime-600">
          {studio.category}
        </p>

        <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
          {studio.title}
        </h3>

        <div className="mt-3 flex items-center gap-1">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />

          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {studio.rating ?? "New"}
          </span>

          <span className="text-xs text-gray-400 dark:text-gray-500">
            Demo Rating
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={16} />
          {studio.location}
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users size={16} />
          Up to {studio.maxCapacity} people
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-lg font-bold text-gray-950 dark:text-white">
            ৳{studio.hourlyRate}

            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {" "}/ hour
            </span>
          </p>

          <Link
            href={`/studios/${studio._id}`}
            className="text-sm font-semibold text-gray-900 transition hover:text-lime-600 dark:text-gray-200 dark:hover:text-lime-400"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
