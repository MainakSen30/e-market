import { useMutation } from "@tanstack/react-query";
import { shopCategories } from "apps/seller-ui/src/utils/categories";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

type CreateShopProps = {
  sellerId: string;
  setActiveStep: (step: number) => void;
};

const CreateShop = ({ sellerId, setActiveStep }: CreateShopProps) => {
  //form hook
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  //create shop mutation
  const createShopMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`, data);
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3)
    }
  });

  //submit handler
  const onSubmit = async(data: any) => {
    const shopData = { ...data, sellerId };
    createShopMutation.mutate(shopData);
  }

  const countWords = (text: string) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/);
    return words.length;
  };

  return <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-2xl font-semibold text-center mb-4">
        Setup your new shop
      </h3>
      {/* form inputs will go here */}
      {/* name */}
      <label className="block text-gray-700 mb-1">Name *</label>
      <input
        type="text"
        placeholder="xyz shop"
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl"
        {...register("name",{
          required:"Name is required",
          minLength:{
            value:3,
            message:"Name must be at least 3 characters long"
          }
        })}
      />
      {errors.name && (
        <p className="text-red-600 text-sm">{String(errors.name.message)}</p>
      )}

      {/* bio */}
      <label className="block text-gray-700 mb-1 mt-3">Bio (Max 100 words) *</label>
      <input
        type="text"
        placeholder="your shop bio will be here..."
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl mt-1"
        {...register("bio", {
          required: "Bio is required",
          validate: (value) =>
            countWords(value) <= 100 || "Bio cannot exceed 100 words",
        })}
      />
      {errors.bio && (
        <p className="text-red-600 text-sm">{String(errors.bio.message)}</p>
      )}

      {/* Address */}
      <label className="block text-gray-700 mb-1 mt-3">Address *</label>
      <input
        type="text"
        placeholder="your shop address will be here..."
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl mt-1"
        {...register("address", {
          required: "Address is required",
        })}
      />
      {errors.address && (
        <p className="text-red-600 text-sm">{String(errors.address.message)}</p>
      )}

      {/* opening hours */}
      <label className="block text-gray-700 mb-1 mt-3">Opening Hours *</label>
      <input
        type="text"
        placeholder="eg. Mon - Fri 9AM - 6PM"
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl mt-1"
        {...register("opening_hours", {
          required: "Opening hours is required",
        })}
      />
      {errors.opening_hours && (
        <p className="text-red-600 text-sm">{String(errors.opening_hours.message)}</p>
      )}

      {/* website */}
      <label className="block text-gray-700 mb-1 mt-3">Website (Optional)</label>
      <input
        type="url"
        placeholder="eg. www.example.com"
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl mt-1"
        {...register("website", {
          required: false,
          pattern: {
            value: /^https?:\/\//,
            message: "Please enter a valid URL",
          },
        })}
      />
      {errors.website && (
        <p className="text-red-600 text-sm">{String(errors.website.message)}</p>
      )}

      {/* categories */}
      <label className="block text-gray-700 mb-1 mt-3">Category *</label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl mt-1"
        {...register("category", {
          required: "Category is required"
        })}
      >
        <option>Select a category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
      </select>
    </form>
  </div>
};

export default CreateShop;
