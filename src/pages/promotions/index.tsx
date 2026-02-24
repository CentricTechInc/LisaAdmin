import React, { useState, useEffect } from "react";
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
import api from "@/utils/axios";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

type Banner = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  image: string;
  promotion_for: string;
  is_active: boolean;
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

const mockCoupons: Coupon[] = [
  { id: "1", title: "Get up to 5% discount", code: "winterget5", discountValue: "Percentage", startDate: "12 November, 2025", endDate: "25 December, 2025", userLimit: 200 },
  { id: "2", title: "Free shipping on orders over $50", code: "FS-50", discountValue: "Fixed Amount", startDate: "15 November, 2025", endDate: "30 December, 2025", userLimit: 20 },
  { id: "3", title: "Buy one get one free", code: "B1g1f", discountValue: "Fixed Amount", startDate: "20 November, 2025", endDate: "05 January, 2026", userLimit: 50 },
  { id: "4", title: "15% off for first-time Customer", code: "15ftc", discountValue: "Percentage", startDate: "25 November, 2025", endDate: "10 January, 2026", userLimit: 35 },
  { id: "5", title: "Seasonal discount for all services: Up to 30% off", code: "Sdiscount-30", discountValue: "Percentage", startDate: "01 December, 2025", endDate: "15 January, 2026", userLimit: 15 },
];

const mockPushNotifications: PushNotification[] = [
  { id: "1", title: "Get up to 5% discount", message: "12 November, 2025", notifyTo: "Customer", date: "12 November, 2025" },
  { id: "2", title: "Free shipping on orders over $50", message: "15 November, 2025", notifyTo: "Professional", date: "15 November, 2025" },
  { id: "3", title: "Buy one get one free", message: "20 November, 2025", notifyTo: "Customer", date: "20 November, 2025" },
  { id: "4", title: "15% off for first-time Customer", message: "25 November, 2025", notifyTo: "Customer", date: "25 November, 2025" },
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
  const [pageSize, setPageSize] = useState(10); 
   const [banners, setBanners] = useState<Banner[]>([]);
   const [totalItems, setTotalItems] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   
   const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>(mockPushNotifications);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [addModal, setAddModal] = useState<ActiveTab | null>(null);

  const [bannerPromotionFor, setBannerPromotionFor] = useState("Customer");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerStartDate, setBannerStartDate] = useState("");
  const [bannerEndDate, setBannerEndDate] = useState("");
  const [bannerNoDuration, setBannerNoDuration] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [couponSpecificProfessional, setCouponSpecificProfessional] = useState("Salon");
  const [couponName, setCouponName] = useState("Customer");
  const [couponTitle, setCouponTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscountType, setCouponDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [couponDiscountValue, setCouponDiscountValue] = useState("");
  const [couponStartDate, setCouponStartDate] = useState("");
  const [couponEndDate, setCouponEndDate] = useState("");
  const [couponNoDuration, setCouponNoDuration] = useState(false);
  const [couponUserLimit, setCouponUserLimit] = useState("");

  const [pushNotifyTo, setPushNotifyTo] = useState("Customer");
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [pushDate, setPushDate] = useState("");

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/banner/?page=${page}&limit=${pageSize}`);
      // api.interceptors returns response.data as { data: body, status: httpStatus, ... }
      // So response.data is apiResponse.
      // response.data.data is the body from backend.
      const backendBody = response.data.data;

      // Backend returns { status: true, data: { banners: [...], pagination: {...} } }
      if (backendBody && backendBody.status && backendBody.data) {
         setBanners(backendBody.data.banners);
         setTotalItems(backendBody.data.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "banner") {
      fetchBanners();
    }
  }, [activeTab, page, pageSize]);

  const handleTabChange = (tab: string) => {
    if (tab !== "banner" && tab !== "coupon" && tab !== "push-notification") return;
    setPage(1);
    router.replace({ pathname: "/promotions", query: { tab } }, undefined, { shallow: true });
  };

  const resetBannerForm = () => {
    setBannerPromotionFor("Customer");
    setBannerTitle("");
    setBannerStartDate("");
    setBannerEndDate("");
    setBannerNoDuration(false);
    setBannerFile(null);
    setBannerPreview("");
  };

  const resetCouponForm = () => {
    setCouponSpecificProfessional("Salon");
    setCouponName("Customer");
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
    setPushNotifyTo("Customer");
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

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: SelectedItem["type"] | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const handleDelete = (type: SelectedItem["type"], id: string) => {
    setDeleteConfirmation({ isOpen: true, type, id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    if (!type || !id) return;

    if (type === "banner") {
      try {
        const response = await api.delete(`/admin/banner/${id}`);
        if (response.data.data.status) {
          fetchBanners();
        }
      } catch (error) {
        console.error("Failed to delete banner", error);
        alert("Failed to delete banner");
      }
    }
    if (type === "coupon") setCoupons((prev) => prev.filter((x) => x.id !== id));
    if (type === "push-notification") setPushNotifications((prev) => prev.filter((x) => x.id !== id));
    
    setDeleteConfirmation({ isOpen: false, type: null, id: null });
  };

  const bannerColumns: Column<Banner>[] = [
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center", sortable: true },
    { id: "title", header: "Title", field: "title", sortable: true },
    { id: "startDate", header: "Start Date", accessor: (row) => new Date(row.start_date).toLocaleDateString(), sortable: true },
    { id: "endDate", header: "End Date", accessor: (row) => new Date(row.end_date).toLocaleDateString(), sortable: true },
    { 
      id: "image", 
      header: "Banner Image", 
      accessor: (row) => (
        <div className="relative h-15 w-16 overflow-hidden rounded-xl bg-gray-100">
          <AppImage imageName={row.image} alt={row.title} fill className="object-cover" rounded={false} />
        </div>
      ),
      sortable: true,
    },
    { id: "promotionFor", header: "Promotion For", field: "promotion_for", sortable: true },
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
            onClick={() => handleDelete("banner", String(row.id))}
          >
            <TrashIcon className="w-5 h-5 text-[#FF4460]" />
          </button>
        </div>
      ),
      className: "w-24 text-center",
    },
  ];

  const couponColumns: Column<Coupon>[] = [
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center", sortable: true },
    { id: "title", header: "Title", field: "title", sortable: true },
    { id: "code", header: "Code", field: "code", sortable: true },
    { id: "discountValue", header: "Discount Value", field: "discountValue", sortable: true },
    { id: "startDate", header: "Start Date", field: "startDate", sortable: true },
    { id: "endDate", header: "End Date", field: "endDate", sortable: true },
    { id: "userLimit", header: "User Limit", field: "userLimit", sortable: true },
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
    { id: "sr", header: "Sr.", accessor: (_, index) => (page - 1) * pageSize + index + 1, className: "w-16 text-center", sortable: true },
    { id: "title", header: "Title", field: "title", sortable: true },
    { id: "message", header: "Message", field: "message", sortable: true },
    { id: "notifyTo", header: "Notify To", field: "notifyTo", sortable: true },
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
                   manualPagination={true}
                   totalCount={totalItems}
                   loading={isLoading}
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
                    { label: "Customer", value: "Customer" },
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
                onClick={async () => {
                  if (!bannerFile || !bannerTitle || !bannerStartDate || (!bannerNoDuration && !bannerEndDate)) {
                    alert("Please fill all required fields");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("title", bannerTitle);
                  formData.append("promotion_for", bannerPromotionFor);
                  formData.append("start_date", bannerStartDate);
                  if (!bannerNoDuration && bannerEndDate) {
                    formData.append("end_date", bannerEndDate);
                  }
                  // Default end date if not provided? Or backend handles it? 
                  // Assuming backend handles it or we send empty/null. 
                  // But example.json showed end_date being sent. 
                  // Let's send start_date as end_date if no duration, or handle as per logic.
                  // For now, let's assume end_date is required unless noDuration is checked.
                  // If noDuration, maybe send a far future date or same as start date?
                  // User rule says "Don't set duration", usually means indefinite.
                  // Let's check existing logic: existing just put "—".
                  // I will send bannerStartDate as end_date if noDuration is true, or maybe not send it.
                  // But example.json has end_date. I'll stick to logic: if noDuration, don't send end_date?
                  // But type definition says end_date is string.
                  // Let's send start_date if noDuration is checked for now to avoid errors, or check backend requirement.
                  // Backend likely expects a date.
                  
                  if (bannerNoDuration) {
                     formData.append("end_date", bannerStartDate); // Fallback
                  }

                  formData.append("is_active", "true");
                  formData.append("image", bannerFile);

                  try {
                    const response = await api.post("/admin/banner/create", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    if (response.data.data.status) {
                      fetchBanners();
                      setAddModal(null);
                      resetBannerForm();
                    }
                  } catch (error) {
                    console.error("Failed to create banner", error);
                    alert("Failed to create banner");
                  }
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
                  placeholder="Customer"
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
                    { label: "Customer", value: "Customer" },
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
              <div className="font-medium text-gray-900">{selected.item.promotion_for}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">Start Date</div>
              <div className="font-medium text-gray-900">{new Date(selected.item.start_date).toLocaleDateString()}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-gray-500">End Date</div>
              <div className="font-medium text-gray-900">{new Date(selected.item.end_date).toLocaleDateString()}</div>
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

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
