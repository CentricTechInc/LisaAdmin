import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UploadArea } from "@/components/ui/UploadArea";
import { AppImage } from "@/components/ui/AppImage";
import { ImageUploadPreview } from "@/components/ui/ImageUploadPreview";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { TrashIcon } from "@/components/ui/TrashIcon";
import { Column } from "@/components/table/types";
import { Modal } from "@/components/ui/Modal";

type Banner = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  promotionFor: string;
};

type Coupon = {
  id: string;
  title: string;
  code: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  userLimit: number;
};

type PushNotification = {
  id: string;
  title: string;
  message: string;
  notifyTo: string;
  date: string;
};

const mockBanners: Banner[] = [
  { id: "1", title: "Get up to 5% discount", startDate: "12 November, 2025", endDate: "25 December, 2025", image: "/images/banner1.jpg", promotionFor: "All" },
  { id: "2", title: "Free shipping on orders over $50", startDate: "15 November, 2025", endDate: "30 December, 2025", image: "/images/banner2.jpg", promotionFor: "Professional" },
  { id: "3", title: "Buy one get one free", startDate: "20 November, 2025", endDate: "05 January, 2026", image: "/images/banner3.jpg", promotionFor: "Customers" },
  { id: "4", title: "15% off for first-time customers", startDate: "25 November, 2025", endDate: "10 January, 2026", image: "/images/banner4.jpg", promotionFor: "Customers" },
  { id: "5", title: "Seasonal discount for all services: Up to 30% off", startDate: "01 December, 2025", endDate: "15 January, 2026", image: "/images/banner5.jpg", promotionFor: "Professional" },
];

const mockCoupons: Coupon[] = [
  { id: "1", title: "Get up to 5% discount", code: "winterget5", discountValue: "Percentage", startDate: "12 November, 2025", endDate: "25 December, 2025", userLimit: 200 },
  { id: "2", title: "Free shipping on orders over $50", code: "FS-50", discountValue: "Fixed Amount", startDate: "15 November, 2025", endDate: "30 December, 2025", userLimit: 20 },
  { id: "3", title: "Buy one get one free", code: "B1g1f", discountValue: "Fixed Amount", startDate: "20 November, 2025", endDate: "05 January, 2026", userLimit: 50 },
  { id: "4", title: "15% off for first-time customers", code: "15ftc", discountValue: "Percentage", startDate: "25 November, 2025", endDate: "10 January, 2026", userLimit: 35 },
  { id: "5", title: "Seasonal discount for all services: Up to 30% off", code: "Sdiscount-30", discountValue: "Percentage", startDate: "01 December, 2025", endDate: "15 January, 2026", userLimit: 15 },
];

const mockPushNotifications: PushNotification[] = [
  { id: "1", title: "Get up to 5% discount", message: "12 November, 2025", notifyTo: "Customers", date: "12 November, 2025" },
  { id: "2", title: "Free shipping on orders over $50", message: "15 November, 2025", notifyTo: "Professional", date: "15 November, 2025" },
  { id: "3", title: "Buy one get one free", message: "20 November, 2025", notifyTo: "Customers", date: "20 November, 2025" },
  { id: "4", title: "15% off for first-time customers", message: "25 November, 2025", notifyTo: "Customers", date: "25 November, 2025" },
  { id: "5", title: "Seasonal discount for all services: Up to 30% off", message: "01 December, 2025", notifyTo: "Professional", date: "01 December, 2025" },
];

type ActiveTab = "banner" | "coupon" | "push-notification";
type SelectedItem =
  | { type: "banner"; item: Banner }
  | { type: "coupon"; item: Coupon }
  | { type: "push-notification"; item: PushNotification };

export default function PromotionsPage() {
  const router = useRouter();
  const activeTab: ActiveTab = (() => {
    const tab = router.query.tab;
    const value = Array.isArray(tab) ? tab[0] : tab;
    if (value === "banner" || value === "coupon" || value === "push-notification") return value;
    return "banner";
  })();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2); // Default to 2 to show pagination with mock data
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>(mockPushNotifications);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [addModal, setAddModal] = useState<ActiveTab | null>(null);

  const [bannerPromotionFor, setBannerPromotionFor] = useState("Customers");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerStartDate, setBannerStartDate] = useState("");
  const [bannerEndDate, setBannerEndDate] = useState("");
  const [bannerNoDuration, setBannerNoDuration] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [couponSpecificProfessional, setCouponSpecificProfessional] = useState("Salon");
  const [couponName, setCouponName] = useState("Customers");
  const [couponTitle, setCouponTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscountType, setCouponDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [couponDiscountValue, setCouponDiscountValue] = useState("");
  const [couponStartDate, setCouponStartDate] = useState("");
  const [couponEndDate, setCouponEndDate] = useState("");
  const [couponNoDuration, setCouponNoDuration] = useState(false);
  const [couponUserLimit, setCouponUserLimit] = useState("");

  const [pushNotifyTo, setPushNotifyTo] = useState("Customers");
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [pushDate, setPushDate] = useState("");

  const handleTabChange = (tab: string) => {
    if (tab !== "banner" && tab !== "coupon" && tab !== "push-notification") return;
    setPage(1);
    router.replace({ pathname: "/promotions", query: { tab } }, undefined, { shallow: true });
  };

  const resetBannerForm = () => {
    setBannerPromotionFor("Customers");
    setBannerTitle("");
    setBannerStartDate("");
    setBannerEndDate("");
    setBannerNoDuration(false);
    setBannerFile(null);
  };

  const resetCouponForm = () => {
    setCouponSpecificProfessional("Salon");
    setCouponName("Customers");
    setCouponTitle("");
    setCouponCode("");
    setCouponDiscountType("percentage");
    setCouponDiscountValue("");
    setCouponStartDate("");
    setCouponEndDate("");
    setCouponNoDuration(false);
    setCouponUserLimit("");
  };

  const resetPushForm = () => {
    setPushNotifyTo("Customers");
    setPushTitle("");
    setPushMessage("");
    setPushDate("");
  };

  const openAddModal = (tab: ActiveTab) => {
    setSelected(null);
    setAddModal(tab);
    if (tab === "banner") resetBannerForm();
    if (tab === "coupon") resetCouponForm();
    if (tab === "push-notification") resetPushForm();
  };

  const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handleDelete = (type: SelectedItem["type"], id: string) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;
    if (type === "banner") setBanners((prev) => prev.filter((x) => x.id !== id));
    if (type === "coupon") setCoupons((prev) => prev.filter((x) => x.id !== id));
    if (type === "push-notification") setPushNotifications((prev) => prev.filter((x) => x.id !== id));
  };

  const bannerColumns: Column<Banner>[] = [
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center" },
    { id: "title", header: "Title", field: "title" },
    { id: "startDate", header: "Start Date", field: "startDate" },
    { id: "endDate", header: "End Date", field: "endDate" },
    { 
      id: "image", 
      header: "Banner Image", 
      accessor: (row) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
          <AppImage imageName={row.image} alt={row.title} fill />
        </div>
      ),
    },
    { id: "promotionFor", header: "Promotion For", field: "promotionFor" },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="View banner"
            className="hover:opacity-80 p-1 rounded hover:bg-gray-100"
            onClick={() => setSelected({ type: "banner", item: row })}
          >
            <EyeIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            aria-label="Delete banner"
            className="hover:opacity-80 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete("banner", row.id)}
          >
            <TrashIcon className="w-5 h-5 text-[#FF4460]" />
          </button>
        </div>
      ),
      className: "w-24 text-center",
    },
  ];

  const couponColumns: Column<Coupon>[] = [
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center" },
    { id: "title", header: "Title", field: "title" },
    { id: "code", header: "Code", field: "code" },
    { id: "discountValue", header: "Discount Value", field: "discountValue" },
    { id: "startDate", header: "Start Date", field: "startDate" },
    { id: "endDate", header: "End Date", field: "endDate" },
    { id: "userLimit", header: "User Limit", field: "userLimit" },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="View coupon"
            className="hover:opacity-80 p-1 rounded hover:bg-gray-100"
            onClick={() => setSelected({ type: "coupon", item: row })}
          >
            <EyeIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            aria-label="Delete coupon"
            className="hover:opacity-80 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete("coupon", row.id)}
          >
            <TrashIcon className="w-5 h-5 text-[#FF4460]" />
          </button>
        </div>
      ),
      className: "w-24 text-center",
    },
  ];

  const pushNotificationColumns: Column<PushNotification>[] = [
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center" },
    { id: "title", header: "Title", field: "title" },
    { id: "message", header: "Message", field: "message" },
    { id: "notifyTo", header: "Notify To", field: "notifyTo" },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="View push notification"
            className="hover:opacity-80 p-1 rounded hover:bg-gray-100"
            onClick={() => setSelected({ type: "push-notification", item: row })}
          >
            <EyeIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            aria-label="Delete push notification"
            className="hover:opacity-80 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete("push-notification", row.id)}
          >
            <TrashIcon className="w-5 h-5 text-[#FF4460]" />
          </button>
        </div>
      ),
      className: "w-24 text-center",
    },
  ];

  const handleAddClick = () => openAddModal(activeTab);

  const getAddButtonText = () => {
    if (activeTab === "banner") return "+ Add Banner";
    if (activeTab === "coupon") return "+ Add Coupon";
    return "+ Add Push Notification";
  };
  return (
    <>
      <Head>
        <title>Promotions | Lisa Admin</title>
      </Head>
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-[#13000A]">Promotions</h2>
              <Button variant="brand" onClick={handleAddClick}>
                {getAddButtonText()}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="w-full sm:w-auto">
                <SegmentedControl
                  options={[
                    { id: "banner", label: "Banner" },
                    { id: "coupon", label: "Coupon" },
                    { id: "push-notification", label: "Push Notification" },
                  ]}
                  value={activeTab}
                  onChange={handleTabChange}
                  className="bg-white p-1 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-500">Show</span>
                 <select 
                   className="border border-gray-200 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-black"
                   value={pageSize}
                   onChange={(e) => setPageSize(Number(e.target.value))}
                 >
                   <option value={10}>10</option>
                   <option value={20}>20</option>
                   <option value={50}>50</option>
                 </select>
                 <span className="text-sm text-gray-500">entries</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-hidden">
               {activeTab === "banner" && (
                 <DataTable 
                   columns={bannerColumns} 
                   data={banners} 
                   page={page}
                   pageSize={pageSize}
                   onPageChange={setPage}
                   selectable={false}
                   showColumnToggle={false}
                 />
               )}
               {activeTab === "coupon" && (
                 <DataTable 
                   columns={couponColumns} 
                   data={coupons}
                   page={page}
                   pageSize={pageSize}
                   onPageChange={setPage}
                   selectable={false}
                   showColumnToggle={false}
                 />
               )}
               {activeTab === "push-notification" && (
                 <DataTable 
                   columns={pushNotificationColumns} 
                   data={pushNotifications}
                   page={page}
                   pageSize={pageSize}
                   onPageChange={setPage}
                   selectable={false}
                   showColumnToggle={false}
                 />
               )}
            </div>
    </div>

      <Modal isOpen={!!addModal} onClose={() => setAddModal(null)} className="max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold text-[#13000A]">
            {addModal === "banner" ? "Add Banner" : addModal === "coupon" ? "Add Coupon" : "Add Push Notification"}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setAddModal(null)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {addModal === "banner" ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex justify-end">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotion For</label>
                <Select
                  options={[
                    { label: "Customers", value: "Customers" },
                    { label: "Professional", value: "Professional" },
                    { label: "All", value: "All" },
                  ]}
                  value={bannerPromotionFor}
                  onChange={(e) => setBannerPromotionFor(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              {bannerPreview ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Upload Your Image</label>
                  <ImageUploadPreview
                    imageName={bannerPreview}
                    alt="Preview"
                    onFileSelect={(file) => {
                      setBannerFile(file);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const res = e.target?.result;
                        if (typeof res === "string") setBannerPreview(res);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="rounded-2xl"
                    imageWrapperClassName="h-48 w-full"
                    imageClassName="object-contain"
                    buttonLabel="Change Image"
                  />
                  <Button
                    variant="ghost"
                    className="text-sm text-red-500 hover:text-red-600 w-fit"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview("");
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
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
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Title"
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={bannerStartDate}
                  onChange={(e) => setBannerStartDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={bannerEndDate}
                  onChange={(e) => setBannerEndDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                  disabled={bannerNoDuration}
                />
              </div>
            </div>

            <div>
              <Checkbox
                checked={bannerNoDuration}
                onChange={(e) => setBannerNoDuration(e.target.checked)}
                label="Don't set duration"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => setAddModal(null)}
                className="w-32 border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                Discard
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  const newItem: Banner = {
                    id: makeId(),
                    title: bannerTitle || "—",
                    startDate: bannerStartDate || "—",
                    endDate: bannerNoDuration ? "—" : bannerEndDate || "—",
                    image: bannerPreview || "",
                    promotionFor: bannerPromotionFor,
                  };
                  setBanners((prev) => [newItem, ...prev]);
                  setAddModal(null);
                }}
                className="w-32"
              >
                Add
              </Button>
            </div>
          </div>
        ) : null}

        {addModal === "coupon" ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Professional</label>
                <Select
                  options={[
                    { label: "Salon", value: "Salon" },
                    { label: "Individual", value: "Individual" },
                  ]}
                  value={couponSpecificProfessional}
                  onChange={(e) => setCouponSpecificProfessional(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Input
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  placeholder="Customers"
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={couponTitle}
                onChange={(e) => setCouponTitle(e.target.value)}
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
                    value={couponDiscountValue}
                    onChange={(e) => setCouponDiscountValue(e.target.value)}
                    placeholder="5"
                    className="bg-white border-gray-200 rounded-xl pr-24"
                  />
                  <div className="absolute right-1 top-1 bottom-1 flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setCouponDiscountType("percentage")}
                      className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${couponDiscountType === "percentage" ? "bg-[#FF4460] text-white" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponDiscountType("fixed")}
                      className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${couponDiscountType === "fixed" ? "bg-[#FF4460] text-white" : "text-gray-500 hover:text-gray-900"}`}
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
                  value={couponStartDate}
                  onChange={(e) => setCouponStartDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={couponEndDate}
                  onChange={(e) => setCouponEndDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                  disabled={couponNoDuration}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Limit</label>
                <Input
                  value={couponUserLimit}
                  onChange={(e) => setCouponUserLimit(e.target.value)}
                  placeholder="200"
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
              <div className="flex items-end">
                <Checkbox
                  checked={couponNoDuration}
                  onChange={(e) => setCouponNoDuration(e.target.checked)}
                  label="Don't set duration"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => setAddModal(null)}
                className="w-32 border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                Discard
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  const discountLabel = couponDiscountType === "percentage" ? "Percentage" : "Fixed Amount";
                  const newItem: Coupon = {
                    id: makeId(),
                    title: couponTitle || "—",
                    code: couponCode || "—",
                    discountValue: discountLabel,
                    startDate: couponStartDate || "—",
                    endDate: couponNoDuration ? "—" : couponEndDate || "—",
                    userLimit: Number(couponUserLimit) || 0,
                  };
                  setCoupons((prev) => [newItem, ...prev]);
                  setAddModal(null);
                }}
                className="w-32"
              >
                Add
              </Button>
            </div>
          </div>
        ) : null}

        {addModal === "push-notification" ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex justify-end">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notify To</label>
                <Select
                  options={[
                    { label: "Customers", value: "Customers" },
                    { label: "Professional", value: "Professional" },
                    { label: "All", value: "All" },
                  ]}
                  value={pushNotifyTo}
                  onChange={(e) => setPushNotifyTo(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder="Notification title"
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <FormTextarea
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                placeholder="Write your message here..."
                className="bg-white border-gray-200 rounded-xl min-h-35"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Input
                  type="date"
                  value={pushDate}
                  onChange={(e) => setPushDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => setAddModal(null)}
                className="w-32 border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                Discard
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  const newItem: PushNotification = {
                    id: makeId(),
                    title: pushTitle || "—",
                    message: pushMessage || "—",
                    notifyTo: pushNotifyTo,
                    date: pushDate || "—",
                  };
                  setPushNotifications((prev) => [newItem, ...prev]);
                  setAddModal(null);
                }}
                className="w-32"
              >
                Add
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} className="max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-[#13000A]">Details</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selected?.type === "banner" ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Title</div>
              <div className="font-medium text-gray-900">{selected.item.title}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Promotion For</div>
              <div className="font-medium text-gray-900">{selected.item.promotionFor}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Start Date</div>
              <div className="font-medium text-gray-900">{selected.item.startDate}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">End Date</div>
              <div className="font-medium text-gray-900">{selected.item.endDate}</div>
            </div>
          </div>
        ) : null}

        {selected?.type === "coupon" ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Title</div>
              <div className="font-medium text-gray-900">{selected.item.title}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Code</div>
              <div className="font-medium text-gray-900">{selected.item.code}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Discount</div>
              <div className="font-medium text-gray-900">{selected.item.discountValue}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">User Limit</div>
              <div className="font-medium text-gray-900">{selected.item.userLimit}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Start Date</div>
              <div className="font-medium text-gray-900">{selected.item.startDate}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">End Date</div>
              <div className="font-medium text-gray-900">{selected.item.endDate}</div>
            </div>
          </div>
        ) : null}

        {selected?.type === "push-notification" ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
              <div className="text-gray-500">Title</div>
              <div className="font-medium text-gray-900">{selected.item.title}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
              <div className="text-gray-500">Message</div>
              <div className="font-medium text-gray-900">{(selected as any).item.message}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Notify To</div>
              <div className="font-medium text-gray-900">{(selected as any).item.notifyTo}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Date</div>
              <div className="font-medium text-gray-900">{(selected as any).item.date}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
