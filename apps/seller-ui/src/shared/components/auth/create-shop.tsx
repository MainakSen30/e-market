"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  Store,
  FileText,
  MapPin,
  Clock,
  Globe,
  Tag,
  AlertCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { shopCategories } from "../../../utils/categories";
import AuthButton from "./auth-button";

type CreateShopFormData = {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website?: string;
  category: string;
};

type CreateShopProps = {
  sellerId: string;
  setActiveStep: (step: number) => void;
};

const CreateShop: React.FC<CreateShopProps> = ({
  sellerId,
  setActiveStep,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShopFormData>();

  const countWords = (text: string) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/);
    return words.length;
  };

  const createShopMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        payload,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success("Shop profile created successfully!");
      setActiveStep(3);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create shop profile. Please try again.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: CreateShopFormData) => {
    setServerError(null);
    let resolvedSellerId = sellerId;
    if (!resolvedSellerId) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/logged-in-seller`,
          { withCredentials: true },
        );
        resolvedSellerId = res.data?.seller?.id;
      } catch {
        // ignore
      }
    }

    if (!resolvedSellerId) {
      setServerError("Seller ID not found. Please log in again.");
      toast.error("Seller ID not found. Please log in again.");
      return;
    }

    const payload = {
      shopName: data.name,
      shopBio: data.bio,
      shopAddress: data.address,
      openingHours: data.opening_hours,
      website: data.website,
      category: data.category,
      sellerId: resolvedSellerId,
      name: data.name,
      bio: data.bio,
      address: data.address,
      opening_hours: data.opening_hours,
    };

    createShopMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Shop Name */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Shop Name *
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Store className="h-4 w-4" />
          </div>
          <input
            id="shop-name"
            type="text"
            placeholder="e.g. Acme Electronics"
            className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("name", {
              required: "Shop name is required",
              minLength: {
                value: 3,
                message: "Shop name must be at least 3 characters",
              },
            })}
          />
        </div>
        {errors.name && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.name.message)}</span>
          </p>
        )}
      </div>

      {/* Shop Bio */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-bio"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Bio (Max 100 words) *
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3.5 text-slate-400">
            <FileText className="h-4 w-4" />
          </div>
          <textarea
            id="shop-bio"
            rows={2}
            placeholder="Describe your shop, products, and mission..."
            className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 resize-none ${
              errors.bio
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("bio", {
              required: "Shop bio is required",
              validate: (value) =>
                countWords(value) <= 100 || "Bio cannot exceed 100 words",
            })}
          />
        </div>
        {errors.bio && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.bio.message)}</span>
          </p>
        )}
      </div>

      {/* Shop Address */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-address"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Business Address *
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <MapPin className="h-4 w-4" />
          </div>
          <input
            id="shop-address"
            type="text"
            placeholder="123 Market St, Suite 400, City, State"
            className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
              errors.address
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("address", {
              required: "Shop address is required",
            })}
          />
        </div>
        {errors.address && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.address.message)}</span>
          </p>
        )}
      </div>

      {/* Opening Hours */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-opening-hours"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Opening Hours *
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Clock className="h-4 w-4" />
          </div>
          <input
            id="shop-opening-hours"
            type="text"
            placeholder="e.g. Mon - Fri 9:00 AM - 6:00 PM"
            className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
              errors.opening_hours
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("opening_hours", {
              required: "Opening hours are required",
            })}
          />
        </div>
        {errors.opening_hours && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.opening_hours.message)}</span>
          </p>
        )}
      </div>

      {/* Website (Optional) */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-website"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Website <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Globe className="h-4 w-4" />
          </div>
          <input
            id="shop-website"
            type="url"
            placeholder="https://www.example.com"
            className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
              errors.website
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("website", {
              required: false,
              pattern: {
                value: /^https?:\/\//,
                message: "Please enter a valid URL starting with http:// or https://",
              },
            })}
          />
        </div>
        {errors.website && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.website.message)}</span>
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="shop-category"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Category *
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Tag className="h-4 w-4" />
          </div>
          <select
            id="shop-category"
            defaultValue=""
            className={`w-full h-11 rounded-xl border pl-10 pr-10 text-sm text-slate-900 bg-slate-50/50 transition-all duration-200 outline-none appearance-none cursor-pointer focus:bg-white focus:ring-2 ${
              errors.category
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
            }`}
            {...register("category", {
              required: "Please select a category",
            })}
          >
            <option value="" disabled>
              Select a category
            </option>
            {shopCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {errors.category && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{String(errors.category.message)}</span>
          </p>
        )}
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 p-3 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <AuthButton
          type="submit"
          isLoading={createShopMutation.isPending}
          loadingText="Creating shop profile..."
        >
          <span>Complete Shop Setup</span>
          <ArrowRight className="w-4 h-4" />
        </AuthButton>
      </div>
    </form>
  );
};

export default CreateShop;
