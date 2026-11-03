
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { TStudio } from "@/types/studio";

const categories = [
  "Photo Studios",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const EditStudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [studio, setStudio] = useState<TStudio | null>(null);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending || !session) return;

    const fetchStudio = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/studios/${id}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const result = await res.json();

        if (!res.ok || !result.data) {
          throw new Error(result.message || "Studio not found");
        }

        setStudio(result.data);
        setAmenitiesText((result.data.amenities || []).join(", "));
      } catch (error) {
        console.error(error);
        toast.error("Could not load studio information.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [id, session, isPending]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!studio) return;

    const { name, value } = e.target;

    setStudio((previous) =>
      previous ? { ...previous, [name]: value } : previous
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studio) return;

    try {
      setSaving(true);

      const payload = {
        title: studio.title,
        category: studio.category,
        hourlyRate: Number(studio.hourlyRate),
        securityDeposit: Number(studio.securityDeposit),
        maxCapacity: Number(studio.maxCapacity),
        location: studio.location,
        imageUrl: studio.imageUrl,
        amenities: amenitiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        overview: studio.overview,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/studios/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Update Studio Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not update studio."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-solid border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-lime-400";

  const labelClass =
    "font-semibold text-gray-800 dark:text-gray-200";

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7] dark:bg-gray-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-lime-500 dark:border-gray-700 dark:border-t-lime-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafaf7] px-4 dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please Sign In
        </h2>

        <Link
          href="/signin"
          className="rounded-full bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-500"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafaf7] px-4 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-400">
          Studio not found.
        </p>

        <Link
          href="/my-listings"
          className="font-semibold text-lime-700 hover:underline dark:text-lime-400"
        >
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-12 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-lime-700 dark:text-lime-400">
            Host Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Update Studio
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Edit your studio information below.
          </p>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-solid border-gray-300 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-gray-600 dark:bg-gray-900 md:p-8"
        >
          {/* Studio Title */}
          <div>
            <label className={labelClass}>Studio Title</label>

            <input
              name="title"
              value={studio.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>

            <select
              name="category"
              value={studio.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              {!categories.includes(studio.category) && (
                <option value={studio.category}>{studio.category}</option>
              )}

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Hourly Rate (৳)</label>

              <input
                type="number"
                name="hourlyRate"
                min="0"
                value={studio.hourlyRate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Security Deposit (৳)
              </label>

              <input
                type="number"
                name="securityDeposit"
                min="0"
                value={studio.securityDeposit}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Capacity and Location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Maximum Capacity</label>

              <input
                type="number"
                name="maxCapacity"
                min="1"
                value={studio.maxCapacity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Location / Address</label>

              <input
                name="location"
                value={studio.location}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL</label>

            <input
              type="url"
              name="imageUrl"
              value={studio.imageUrl}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Amenities */}
          <div>
            <label className={labelClass}>
              Amenities (comma separated)
            </label>

            <input
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              placeholder="WiFi, Air Conditioning, Lighting Equipment"
              className={inputClass}
            />
          </div>

          {/* Overview */}
          <div>
            <label className={labelClass}>Detailed Overview</label>

            <textarea
              name="overview"
              value={studio.overview}
              onChange={handleChange}
              required
              rows={5}
              className={inputClass}
            />
          </div>

          {/* Host Information */}
          <div className="grid gap-5 rounded-xl border border-solid border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/70 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Host Name (Read-only)
              </label>

              <input
                value={studio.hostName}
                readOnly
                className={`${inputClass} bg-gray-100 dark:bg-gray-700 dark:text-gray-300`}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Host Email (Read-only)
              </label>

              <input
                value={studio.hostEmail}
                readOnly
                className={`${inputClass} bg-gray-100 dark:bg-gray-700 dark:text-gray-300`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-bold text-black transition hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Studio"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditStudioPage;
