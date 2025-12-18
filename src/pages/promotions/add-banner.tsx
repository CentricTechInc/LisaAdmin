import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { UploadArea } from "@/components/ui/UploadArea";
import { AppImage } from "@/components/ui/AppImage";

export default function AddBannerPage() {
  const router = useRouter();
  const [promotionFor, setPromotionFor] = useState("Customers");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noDuration, setNoDuration] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleDiscard = () => {
    router.back();
  };

  const handleAdd = () => {
    // Implement add logic here
    console.log({ promotionFor, title, startDate, endDate, noDuration });
    router.push("/promotions");
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

        <h1 className="text-2xl font-bold mb-8 text-[#13000A]">Add Banner</h1>

        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
             <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotion For</label>
                <Select
                  options={[
                    { label: "Customers", value: "Customers" },
                    { label: "Professional", value: "Professional" },
                    { label: "All", value: "All" },
                  ]}
                  value={promotionFor}
                  onChange={(e) => setPromotionFor(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
             </div>
          </div>

          <div>
            <UploadArea
              onFileSelect={(file) => {
                setBannerFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                  const res = e.target?.result;
                  if (typeof res === "string") setBannerPreview(res);
                };
                reader.readAsDataURL(file);
              }}
            />
            {bannerPreview ? (
              <div className="mt-3">
                <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200">
                  <AppImage imageName={bannerPreview} alt="Preview" fill className="object-contain" />
                </div>
                <Button 
                  variant="ghost" 
                  className="mt-2 text-sm text-red-500 hover:text-red-600"
                  onClick={() => {
                    setBannerFile(null);
                    setBannerPreview(null);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="25" 
              className="bg-white border-gray-200 rounded-xl"
            />
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
                disabled={noDuration}
              />
            </div>
          </div>

          <div>
            <Checkbox 
                id="no-duration" 
                checked={noDuration}
                onChange={(e) => setNoDuration(e.target.checked)}
                label="Don't set duration"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button variant="ghost" onClick={handleDiscard} className="text-gray-500 hover:text-gray-700">
              Discard
            </Button>
            <Button variant="brand" onClick={handleAdd} className="px-8">
              Add
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
