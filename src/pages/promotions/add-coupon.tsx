import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

export default function AddCouponPage() {
  const router = useRouter();
  const [specificProfessional, setSpecificProfessional] = useState("Salon");
  const [name, setName] = useState("Customers");
  const [title, setTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noDuration, setNoDuration] = useState(false);

  const handleDiscard = () => {
    router.back();
  };

  const handleAdd = () => {
    // Implement add logic here
    console.log({ 
        specificProfessional, 
        name, 
        title, 
        couponCode, 
        discountType, 
        discountValue, 
        startDate, 
        endDate, 
        noDuration 
    });
    router.push("/promotions?tab=coupon");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-3xl p-8 relative">
        <button 
          onClick={handleDiscard}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold mb-8 text-[#13000A]">Add Coupon</h1>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Professional</label>
              <Select
                options={[
                  { label: "Salon", value: "Salon" },
                  { label: "Individual", value: "Individual" },
                ]}
                value={specificProfessional}
                onChange={(e) => setSpecificProfessional(e.target.value)}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customers"
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Flash Sale! 50% Off Today Only" 
              className="bg-white border-gray-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="winterget5"
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
              <div className="relative">
                  <Input
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="5"
                    className="bg-white border-gray-200 rounded-xl pr-24"
                  />
                  <div className="absolute right-1 top-1 bottom-1 flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setDiscountType("percentage")}
                        className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${discountType === 'percentage' ? 'bg-[#FF4460] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType("fixed")}
                        className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${discountType === 'fixed' ? 'bg-[#FF4460] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        $
                      </button>
                  </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Checkbox 
                checked={noDuration} 
                onChange={(e) => setNoDuration(e.target.checked)}
                label="Don't set duration"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button variant="ghost" onClick={handleDiscard} className="w-32 border border-gray-200 text-gray-500 hover:bg-gray-50">
              Discard
            </Button>
            <Button variant="brand" onClick={handleAdd} className="w-32 bg-[#FF4460] hover:bg-[#FF4460]/90">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
