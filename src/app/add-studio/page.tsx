
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-lime-400 dark:focus:ring-lime-900/40";

const labelClass =
  "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300";

const headingClass =
  "border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 dark:border-gray-700 dark:text-white";

const AddStudioPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    overview: "",
    amenities: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (formData.amenities.includes(value)) {
      toast.error("This amenity already exists.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      amenities: [...previous.amenities, value],
    }));

    setAmenityInput("");
  };

  const removeAmenity = (amenity: string) => {
    setFormData((previous) => ({
      ...previous,
      amenities: previous.amenities.filter((item) => item !== amenity),
    }));
  };

  const uploadImage = async () => {
    if (!imageFile) {
      throw new Error("Please select a studio image.");
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFile);

    setUploading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-image`,
        {
          method: "POST",
          body: uploadData,
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success || !result.imageUrl) {
        throw new Error(result.message || "Image upload failed");
      }

      return result.imageUrl as string;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in first.");
      router.push("/signin");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a studio image.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a studio category.");
      return;
    }

    if (
      Number(formData.hourlyRate) <= 0 ||
      Number(formData.securityDeposit) < 0 ||
      Number(formData.maxCapacity) <= 0
    ) {
      toast.error("Please enter valid pricing and capacity.");
      return;
    }

    try {
      setIsSubmitting(true);

      const uploadedImageUrl = await uploadImage();

      const studioData = {
        ...formData,
        imageUrl: uploadedImageUrl,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit),
        maxCapacity: Number(formData.maxCapacity),
        hostName: session.user.name,
        hostEmail: session.user.email,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/studios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(studioData),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to add studio");
      }

      toast.success("Studio listed successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Add Studio Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add your studio. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] dark:bg-gray-950">
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
          Sign in to list your creative space.
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
    <main className="min-h-screen bg-[#fafaf7] px-4 py-14 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/my-listings"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-lime-700 dark:text-lime-400">
            Host Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            List Your Studio
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Share your creative space with creators and professionals.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-8"
        >
          {/* Studio Information */}
          <section className="space-y-5">
            <h2 className={headingClass}>
              Studio Information
            </h2>

            <div>
              <label className={labelClass}>
                Studio Title *
              </label>

              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Photography Studio"
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Category *
                </label>

                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Capacity *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Location *
              </label>

              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Gulshan, Dhaka"
                className={inputClass}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className={labelClass}>
                Studio Image *
              </label>

              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files?.[0] || null);
                }}
                className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-lime-100 file:px-3 file:py-2 file:font-semibold file:text-gray-800 dark:file:bg-lime-400/20 dark:file:text-lime-300`}
              />

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Select a studio image from your computer. Maximum size: 5 MB.
              </p>

              {imageFile && (
                <p className="mt-2 text-sm font-medium text-lime-700 dark:text-lime-400">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Studio Overview *
              </label>

              <textarea
                required
                rows={5}
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Describe your studio, its features and what creators can do here..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="space-y-5">
            <h2 className={headingClass}>
              Pricing
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Hourly Rate (৳) *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Security Deposit (৳) *
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Studio Amenities */}
          <section className="space-y-5">
            <h2 className={headingClass}>
              Studio Amenities
            </h2>

            <div className="flex gap-2">
              <input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="e.g. High-speed Wi-Fi"
                className={`min-w-0 flex-1 ${inputClass}`}
              />

              <button
                type="button"
                onClick={addAmenity}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-lime-500 dark:text-gray-950 dark:hover:bg-lime-400"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-2 rounded-full border border-lime-200 bg-lime-100 px-4 py-2 text-sm font-medium text-gray-800 dark:border-lime-800 dark:bg-lime-950/50 dark:text-lime-200"
                >
                  {amenity}

                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-gray-500 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    aria-label={`Remove ${amenity}`}
                  >
                    <X size={15} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Host Information */}
          <section className="space-y-3">
            <h2 className={headingClass}>
              Host Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Host Name
                </label>

                <input
                  readOnly
                  value={session.user.name}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Host Email
                </label>

                <input
                  readOnly
                  value={session.user.email}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 py-4 font-bold text-gray-900 transition hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading Image..."
              : isSubmitting
                ? "Publishing Studio..."
                : "Publish Studio"}

            {!isSubmitting && !uploading && <Plus size={19} />}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddStudioPage;
