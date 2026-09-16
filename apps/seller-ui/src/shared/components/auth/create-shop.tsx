import { useMutation } from "@tanstack/react-query";
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
      
    </form>
  </div>
};

export default CreateShop;
