import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormTextarea } from "@/components/ui/FormTextarea";

export default function AddPushNotificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifyTo, setNotifyTo] = useState("Customers");
  const [date, setDate] = useState("");

  const handleDiscard = () => {
    router.back();
  };

  const handleAdd = () => {
    // Implement add logic here
    console.log({ title, message, notifyTo, date });
    router.push("/promotions?tab=push-notification");
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

        <h1 className="text-2xl font-bold mb-8 text-[#13000A]">Add Push Notification</h1>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification Title" 
              className="bg-white border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <FormTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="bg-white border-gray-200 rounded-xl min-h-30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notify To</label>
              <Select
                options={[
                  { label: "Customers", value: "Customers" },
                  { label: "Professional", value: "Professional" },
                  { label: "All", value: "All" },
                ]}
                value={notifyTo}
                onChange={(e) => setNotifyTo(e.target.value)}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button variant="ghost" onClick={handleDiscard} className="w-32 border border-gray-200 text-gray-500 hover:bg-gray-50">
              Discard
            </Button>
            <Button variant="brand" onClick={handleAdd} className="w-32 bg-[#FF4460] hover:bg-[#FF4460]/90">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
