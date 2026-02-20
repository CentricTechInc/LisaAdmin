import React, { useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import { TrashIcon } from "@/components/ui/TrashIcon";
import { Modal } from "@/components/ui/Modal";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { Select } from "@/components/ui/Select";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { AppImage } from "@/components/ui/AppImage";
import { ImageUploadPreview } from "@/components/ui/ImageUploadPreview";
import { UploadArea } from "@/components/ui/UploadArea";
import api from "@/utils/axios";

// Mock Data
const categoriesData = [
  { id: 1, name: "Hair", serviceFor: "For All", image: "hair.png" },
  { id: 2, name: "Skincare", serviceFor: "For All", image: "skincare.png" },
  { id: 3, name: "Makeup", serviceFor: "For All", image: "makeup.png" },
  { id: 4, name: "Nail", serviceFor: "For All", image: "nail.png" },
  { id: 5, name: "Massage/Spa", serviceFor: "For All", image: "massage.png" },
];

const subCategoriesData = [
  {
    id: 1,
    name: "Hair Wash & Blow-Dry/Styling",
    category: "Hair",
    price: 48.50,
    serviceFor: "For All",
    image: "hair-wash.png",
    description: "Revitalize your look with a refreshing wash and blow-dry. Enjoy sleek, styled hair that shines and turns heads!",
  },
  {
    id: 2,
    name: "Skincare",
    category: "Skincare",
    price: 72.30,
    serviceFor: "For All",
    image: "skincare-sub.png",
    description: "",
  },
  {
    id: 3,
    name: "Makeup",
    category: "Makeup",
    price: 59.99,
    serviceFor: "For All",
    image: "makeup-sub.png",
    description: "",
  },
  {
    id: 4,
    name: "Nail",
    category: "Nail",
    price: 39.75,
    serviceFor: "For All",
    image: "nail-sub.png",
    description: "",
  },
];

// Icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);
const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6" /></svg>
);

// Inline Edit Icon
const EditIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("text-gray-500", className)}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState(categoriesData);
  const [subCategories, setSubCategories] = useState(subCategoriesData);
  const [activeTab, setActiveTab] = useState("categories");
  const [categoryServiceFilter, setCategoryServiceFilter] = useState("all");
  const [subCategoryServiceFilter, setSubCategoryServiceFilter] = useState("all");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categoriesData[0] | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<typeof subCategoriesData[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const resolveCategoryImage = (value?: string) => {
    if (!value) return "/images/avatar.png";
    if (value.startsWith("data:") || value.startsWith("http") || value.startsWith("/")) return value;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/categories/${value}`;
  };

  const resolveSubCategoryImage = (value?: string) => {
    if (!value) return "/images/avatar.png";
    if (value.startsWith("data:") || value.startsWith("http") || value.startsWith("/")) return value;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/subcategories/${value}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const normalizedFilter = categoryServiceFilter.trim().toLowerCase();
        const serviceForParam =
          normalizedFilter === "all"
            ? "For All"
            : normalizedFilter === "man"
              ? "Man"
              : normalizedFilter === "woman"
                ? "Woman"
                : normalizedFilter === "kid"
                  ? "Kid"
                  : "For All";
        const response = await api.get("/category/listing", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: serviceForParam ? { service_for: serviceForParam } : undefined,
        });
        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const toNumberValue = (value: unknown) => {
          if (typeof value === "number") return value;
          if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? undefined : parsed;
          }
          return undefined;
        };
        const toRecordArray = (value: unknown) =>
          Array.isArray(value) ? value.filter(isRecord) : [];

        const serverData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        let rawItems = toRecordArray(serverData);
        if (rawItems.length === 0 && isRecord(serverData)) {
          rawItems = toRecordArray(serverData["data"]);
        }
        if (rawItems.length === 0 && isRecord(serverData)) {
          rawItems = toRecordArray(serverData["items"]);
        }

        const mapped = rawItems.map((item, index) => {
          const serviceForRaw =
            toStringValue(item["service_for"]) ??
            toStringValue(item["serviceFor"]) ??
            (isRecord(item["service_for"]) ? toStringValue(item["service_for"]["name"]) : undefined) ??
            toStringValue(item["service_for_name"]);
          const normalizedServiceFor = (serviceForRaw ?? "").trim().toLowerCase();
          const serviceFor =
            normalizedServiceFor === "all" || normalizedServiceFor === "for all"
              ? "For All"
              : normalizedServiceFor === "man" || normalizedServiceFor === "male"
                ? "Man"
                : normalizedServiceFor === "woman" || normalizedServiceFor === "female"
                  ? "Woman"
                  : normalizedServiceFor === "kid" || normalizedServiceFor === "kids" || normalizedServiceFor === "child"
                    ? "Kid"
                    : serviceForRaw || "For All";

          return {
            id:
              toNumberValue(item["id"]) ??
              toNumberValue(item["category_id"]) ??
              toNumberValue(item["_id"]) ??
              index + 1,
            name:
              toStringValue(item["name"]) ??
              toStringValue(item["title"]) ??
              toStringValue(item["category_name"]) ??
              "Unknown",
            serviceFor,
            image:
              resolveCategoryImage(
                toStringValue(item["image"]) ??
                toStringValue(item["picture"]) ??
                toStringValue(item["icon"]) ??
                toStringValue(item["thumbnail"]) ??
                toStringValue(item["image_url"]) ??
                "/images/avatar.png"
              ),
          };
        });

        setCategories(mapped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [categoryServiceFilter]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const normalizedFilter = subCategoryServiceFilter.trim().toLowerCase();
        const serviceForParam =
          normalizedFilter === "all"
            ? "For All"
            : normalizedFilter === "man"
              ? "Man"
              : normalizedFilter === "woman"
                ? "Woman"
                : normalizedFilter === "kid"
                  ? "Kid"
                  : undefined;
        const categoryParam = categoryFilter !== "All" ? categoryFilter : undefined;
        const response = await api.get("/subcategory/listing", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params:
            serviceForParam || categoryParam
              ? {
                  ...(categoryParam ? { category: categoryParam } : {}),
                  ...(serviceForParam ? { service_for: serviceForParam } : {}),
                }
              : undefined,
        });
        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const toNumberValue = (value: unknown) => {
          if (typeof value === "number") return value;
          if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? undefined : parsed;
          }
          return undefined;
        };
        const toRecordArray = (value: unknown) =>
          Array.isArray(value) ? value.filter(isRecord) : [];

        const serverData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        let rawItems = toRecordArray(serverData);
        if (rawItems.length === 0 && isRecord(serverData)) {
          rawItems = toRecordArray(serverData["data"]);
        }
        if (rawItems.length === 0 && isRecord(serverData)) {
          rawItems = toRecordArray(serverData["items"]);
        }
        if (rawItems.length === 0) {
          rawItems = toRecordArray(serverResponse);
        }

        const mapped = rawItems.map((item, index) => {
          const serviceForRaw =
            toStringValue(item["service_for"]) ??
            toStringValue(item["serviceFor"]) ??
            (isRecord(item["service_for"]) ? toStringValue(item["service_for"]["name"]) : undefined) ??
            toStringValue(item["service_for_name"]);
          const normalizedServiceFor = (serviceForRaw ?? "").trim().toLowerCase();
          const serviceFor =
            normalizedServiceFor === "all" || normalizedServiceFor === "for all"
              ? "For All"
              : normalizedServiceFor === "man" || normalizedServiceFor === "male"
                ? "Man"
                : normalizedServiceFor === "woman" || normalizedServiceFor === "female"
                  ? "Woman"
                  : normalizedServiceFor === "kid" || normalizedServiceFor === "kids" || normalizedServiceFor === "child"
                    ? "Kid"
                    : serviceForRaw || "For All";

          const categoryName =
            (isRecord(item["category"]) ? toStringValue(item["category"]["name"]) : undefined) ??
            toStringValue(item["category_name"]) ??
            "Unknown";

          return {
            id:
              toNumberValue(item["id"]) ??
              toNumberValue(item["subcategory_id"]) ??
              toNumberValue(item["_id"]) ??
              index + 1,
            name: toStringValue(item["name"]) ?? "Unknown",
            category: categoryName,
            price: toNumberValue(item["price"]) ?? 0,
            serviceFor,
            image: resolveSubCategoryImage(
              toStringValue(item["image"]) ??
                toStringValue(item["picture"]) ??
                toStringValue(item["icon"]) ??
                toStringValue(item["thumbnail"]) ??
                toStringValue(item["image_url"]) ??
                "/images/avatar.png"
            ),
            description: toStringValue(item["description"]) ?? "",
          };
        });

        setSubCategories(mapped);
      } catch (error) {
        console.error("Failed to fetch sub categories:", error);
      }
    };

    if (activeTab === "sub-categories") {
      fetchSubCategories();
    }
  }, [activeTab, subCategoryServiceFilter, categoryFilter]);

  const handleEditCategory = (category: typeof categoriesData[0]) => {
    setEditingCategory(category);
    setSelectedImage(null);
    setSelectedFile(null);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const serviceFor = formData.get("serviceFor") as string;
    const normalizedServiceFor = serviceFor.trim().toLowerCase();
    const serviceForLabel =
      normalizedServiceFor === "all"
        ? "For All"
        : normalizedServiceFor === "man"
          ? "Man"
          : normalizedServiceFor === "woman"
            ? "Woman"
            : normalizedServiceFor === "kid"
              ? "Kid"
              : serviceFor;

    if (editingCategory) {
      try {
        const payload = new FormData();
        payload.append("name", name);
        payload.append("service_for", serviceForLabel);
        if (selectedFile) payload.append("image", selectedFile);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await api.put(`/category/update/${editingCategory.id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const responseData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        const updated = isRecord(responseData) ? responseData : undefined;

        const updatedName = updated ? toStringValue(updated["name"]) : undefined;
        const updatedServiceFor =
          updated && toStringValue(updated["service_for"]) ? toStringValue(updated["service_for"]) : undefined;
        const updatedImage =
          updated
            ? toStringValue(updated["image"]) ??
            toStringValue(updated["picture"]) ??
            toStringValue(updated["icon"]) ??
            toStringValue(updated["thumbnail"]) ??
            toStringValue(updated["image_url"])
            : undefined;

        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? {
                ...cat,
                name: updatedName ?? name,
                serviceFor: updatedServiceFor ?? serviceForLabel,
                image: resolveCategoryImage(updatedImage ?? selectedImage ?? cat.image),
              }
              : cat
          )
        );
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    } else {
      try {
        const payload = new FormData();
        payload.append("name", name);
        payload.append("service_for", serviceForLabel);
        if (selectedFile) payload.append("image", selectedFile);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await api.post("/category/create", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const toNumberValue = (value: unknown) => {
          if (typeof value === "number") return value;
          if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? undefined : parsed;
          }
          return undefined;
        };
        const responseData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        const created = isRecord(responseData) ? responseData : undefined;

        const createdId = created ? toNumberValue(created["id"]) ?? toNumberValue(created["category_id"]) : undefined;
        const createdName = created ? toStringValue(created["name"]) : undefined;
        const createdServiceFor = created ? toStringValue(created["service_for"]) : undefined;
        const createdImage =
          created
            ? toStringValue(created["image"]) ??
              toStringValue(created["picture"]) ??
              toStringValue(created["icon"]) ??
              toStringValue(created["thumbnail"]) ??
              toStringValue(created["image_url"])
            : undefined;

        setCategories((prev) => [
          ...prev,
          {
            id: createdId ?? Math.max(...prev.map((c) => c.id)) + 1,
            name: createdName ?? name,
            serviceFor: createdServiceFor ?? serviceForLabel,
            image: resolveCategoryImage(createdImage ?? selectedImage ?? "/images/avatar.png"),
          },
        ]);
      } catch (error) {
        console.error("Failed to create category:", error);
      }
    }
    handleCloseCategoryModal();
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await api.delete(`/category/delete/${categoryId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await api.delete(`/subcategory/delete/${subCategoryId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setSubCategories((prev) => prev.filter((sub) => sub.id !== subCategoryId));
    } catch (error) {
      console.error("Failed to delete sub category:", error);
    }
  };

  const handleEditSubCategory = (subCategory: typeof subCategoriesData[0]) => {
    setEditingSubCategory(subCategory);
    setSelectedImage(null);
    setIsSubCategoryModalOpen(true);
  };

  const handleCloseSubCategoryModal = () => {
    setIsSubCategoryModalOpen(false);
    setEditingSubCategory(null);
    setSelectedImage(null);
  };

  const handleSaveSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const serviceFor = formData.get("serviceFor") as string;
    const description = formData.get("description") as string;
    const normalizedServiceFor = serviceFor.trim().toLowerCase();
    const serviceForLabel =
      normalizedServiceFor === "all"
        ? "For All"
        : normalizedServiceFor === "man"
          ? "Man"
          : normalizedServiceFor === "woman"
            ? "Woman"
            : normalizedServiceFor === "kid"
              ? "Kid"
              : serviceFor;
    const matchedCategory = categories.find((cat) => cat.name === category);

    if (editingSubCategory) {
      try {
        const payload = new FormData();
        payload.append("name", name);
        if (matchedCategory?.id !== undefined) {
          payload.append("category_id", String(matchedCategory.id));
        }
        payload.append("service_for", serviceForLabel);
        if (selectedFile) payload.append("image", selectedFile);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await api.put(`/subcategory/update/${editingSubCategory.id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const responseData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        const updated = isRecord(responseData) ? responseData : undefined;

        const updatedName = updated ? toStringValue(updated["name"]) : undefined;
        const updatedServiceFor = updated ? toStringValue(updated["service_for"]) : undefined;
        const updatedImage =
          updated
            ? toStringValue(updated["image"]) ??
              toStringValue(updated["picture"]) ??
              toStringValue(updated["icon"]) ??
              toStringValue(updated["thumbnail"]) ??
              toStringValue(updated["image_url"])
            : undefined;
        const updatedCategoryName =
          updated
            ? (isRecord(updated["category"]) ? toStringValue(updated["category"]["name"]) : undefined) ??
              toStringValue(updated["category_name"]) ??
              matchedCategory?.name
            : matchedCategory?.name;

        setSubCategories((prev) =>
          prev.map((sub) =>
            sub.id === editingSubCategory.id
              ? {
                  ...sub,
                  name: updatedName ?? name,
                  category: updatedCategoryName ?? category,
                  price,
                  serviceFor: updatedServiceFor ?? serviceForLabel,
                  description,
                  image: resolveSubCategoryImage(updatedImage ?? selectedImage ?? sub.image),
                }
              : sub
          )
        );
      } catch (error) {
        console.error("Failed to update sub category:", error);
      }
    } else {
      try {
        const payload = new FormData();
        payload.append("name", name);
        if (matchedCategory?.id !== undefined) {
          payload.append("category_id", String(matchedCategory.id));
        }
        payload.append("service_for", serviceForLabel);
        if (selectedFile) payload.append("image", selectedFile);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await api.post("/subcategory/create", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const serverResponse = response.data.data as unknown;
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;
        const toStringValue = (value: unknown) =>
          typeof value === "string" || typeof value === "number" ? String(value) : undefined;
        const toNumberValue = (value: unknown) => {
          if (typeof value === "number") return value;
          if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? undefined : parsed;
          }
          return undefined;
        };
        const responseData = isRecord(serverResponse) ? serverResponse["data"] : undefined;
        const created = isRecord(responseData) ? responseData : undefined;

        const createdId = created ? toNumberValue(created["id"]) ?? toNumberValue(created["subcategory_id"]) : undefined;
        const createdName = created ? toStringValue(created["name"]) : undefined;
        const createdServiceFor = created ? toStringValue(created["service_for"]) : undefined;
        const createdImage =
          created
            ? toStringValue(created["image"]) ??
              toStringValue(created["picture"]) ??
              toStringValue(created["icon"]) ??
              toStringValue(created["thumbnail"]) ??
              toStringValue(created["image_url"])
            : undefined;
        const createdCategoryName =
          created
            ? (isRecord(created["category"]) ? toStringValue(created["category"]["name"]) : undefined) ??
              toStringValue(created["category_name"]) ??
              matchedCategory?.name
            : matchedCategory?.name;

        setSubCategories((prev) => [
          ...prev,
          {
            id: createdId ?? Math.max(...prev.map((s) => s.id)) + 1,
            name: createdName ?? name,
            category: createdCategoryName ?? category,
            price,
            serviceFor: createdServiceFor ?? serviceForLabel,
            image: resolveSubCategoryImage(createdImage ?? selectedImage ?? "/images/avatar.png"),
            description,
          },
        ]);
      } catch (error) {
        console.error("Failed to create sub category:", error);
      }
    }
    handleCloseSubCategoryModal();
  };

  // Columns for Categories
  const categoryColumns: Column<typeof categoriesData[0]>[] = [
    {
      id: "sr_no",
      header: "Sr. No.",
      accessor: (_, index) => index + 1,
      sortable: true,
    },
    {
      id: "name",
      header: "Category Name",
      field: "name",
      sortable: true,
    },
    {
      id: "serviceFor",
      header: "Service For",
      field: "serviceFor",
      sortable: true,
    },
    {
      id: "image",
      header: "Image",
      accessor: (row) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          <AppImage imageName={row.image} alt={row.name} fill />
        </div>
      ),
      sortable: true,
    },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded p-1 hover:bg-gray-100"
            onClick={() => handleEditCategory(row)}
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded p-1 hover:bg-red-50"
            onClick={() => handleDeleteCategory(row.id)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  // Columns for Sub Categories
  const subCategoryColumns: Column<typeof subCategoriesData[0]>[] = [
    {
      id: "sr_no",
      header: "Sr. No.",
      accessor: (_, index, actions) => (
        <div className="flex items-center gap-2 font-medium">
          <button
            onClick={(e) => { e.stopPropagation(); actions?.toggleExpand(); }}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
          >
            {actions?.isExpanded ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {index + 1}
        </div>
      ),
      sortable: true,
    },
    {
      id: "name",
      header: "Sub Service Name",
      field: "name",
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      field: "category",
      sortable: true,
    },
    {
      id: "price",
      header: "Price",
      accessor: (row) => `$${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      id: "serviceFor",
      header: "Service For",
      field: "serviceFor",
      sortable: true,
    },
    {
      id: "image",
      header: "Image",
      accessor: (row) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          <AppImage imageName={row.image} alt={row.name} fill />
        </div>
      ),
      sortable: true,
    },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded p-1 hover:bg-gray-100"
            onClick={() => handleEditSubCategory(row)}
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded p-1 hover:bg-red-50"
            onClick={() => handleDeleteSubCategory(row.id)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  const filteredSubCategories = subCategories.filter((sub) => {
    if (categoryFilter !== "All" && sub.category !== categoryFilter) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <Button
            variant="brand"
            onClick={() => activeTab === "categories" ? setIsCategoryModalOpen(true) : setIsSubCategoryModalOpen(true)}
          >
            + {activeTab === "categories" ? "Add Category" : "Add Sub Categories"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-fit">
            <SegmentedControl
              options={[
                { id: "categories", label: "Categories" },
                { id: "sub-categories", label: "Sub Categories" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {activeTab === "sub-categories" && (
            <div className="w-64">
              <Select
                options={[
                  { label: "All Categories", value: "All" },
                  ...categories.map((c) => ({ label: c.name, value: c.name })),
                ]}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF4460]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          <div className="w-fit">
            <SegmentedControl
              options={[
                { id: "all", label: "For All" },
                { id: "woman", label: "Woman" },
                { id: "man", label: "Man" },
                { id: "kid", label: "Kid" },
              ]}
              value={activeTab === "categories" ? categoryServiceFilter : subCategoryServiceFilter}
              onChange={(value) => {
                if (activeTab === "categories") {
                  setCategoryServiceFilter(value);
                } else {
                  setSubCategoryServiceFilter(value);
                }
              }}
              className="bg-white border-gray-200"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6  shadow-sm border border-gray-100">
          {activeTab === "categories" ? (
            <DataTable
              key="categories-table"
              columns={categoryColumns}
              data={categories}
              pageSize={10}
              selectable={false}
              showColumnToggle={false}
            />
          ) : (
            <DataTable
              key="sub-categories-table"
              columns={subCategoryColumns}
              data={filteredSubCategories}
              pageSize={10}
              selectable={false}
              showColumnToggle={false}
              renderSubComponent={(row) => (
                <div className="text-sm text-gray-600 pl-14">
                  <span className="font-semibold text-gray-900">Description: </span>
                  {row.description || "No description available."}
                </div>
              )}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={handleCloseCategoryModal}>
        <form onSubmit={handleSaveCategory} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#13000A]">{editingCategory ? "Edit Category" : "Add Category"}</h2>
            <button type="button" onClick={handleCloseCategoryModal} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Upload Your The Image</label>
            <div className="flex flex-col items-center gap-4">
              {(editingCategory || selectedImage) && (
                <ImageUploadPreview
                  imageName={selectedImage || editingCategory?.image || "avatar.png"}
                  alt="Category Preview"
                  onFileSelect={handleFileSelect}
                />
              )}

              {!editingCategory && !selectedImage && <UploadArea onFileSelect={handleFileSelect} label={null} className="w-full" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="name"
              label="Category Name"
              placeholder="Grooming"
              defaultValue={editingCategory?.name || ""}
              wrapperClassName="col-span-1"
            />

            <div className="flex flex-col gap-2 col-span-1">
              <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">Service For</label>
              <Select
                name="serviceFor"
                className="h-10 w-full rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] focus:border-[#FF4460] focus:outline-none"
                options={[
                  { label: "Man", value: "man" },
                  { label: "Woman", value: "woman" },
                  { label: "Kid", value: "kid" },
                  { label: "For All", value: "all" },
                ]}
                defaultValue={editingCategory?.serviceFor === "For All" ? "all" : (editingCategory?.serviceFor || "").toLowerCase()}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="brand" type="submit">
              {editingCategory ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add/Edit Sub Category Modal */}
      <Modal isOpen={isSubCategoryModalOpen} onClose={handleCloseSubCategoryModal}>
        <form onSubmit={handleSaveSubCategory} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{editingSubCategory ? "Edit Sub Categories" : "Add Sub Categories"}</h2>
            <button type="button" onClick={handleCloseSubCategoryModal} className="rounded-full border border-gray-200 p-2 hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">Upload Your The Image</label>
            <div className="flex flex-col items-center gap-4">
              {(editingSubCategory || selectedImage) && (
                <ImageUploadPreview
                  imageName={selectedImage || editingSubCategory?.image || "avatar.png"}
                  alt="Sub Category Preview"
                  onFileSelect={handleFileSelect}
                />
              )}

              {!editingSubCategory && !selectedImage && <UploadArea onFileSelect={handleFileSelect} label={null} className="w-full" />}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              name="name"
              label="Sub Category Name"
              placeholder="Hair Wash & Blow-Dry/Styling"
              wrapperClassName="w-full"
              defaultValue={editingSubCategory?.name || ""}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-1">
                <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">Category</label>
                <Select
                  name="category"
                  className="h-10 w-full rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] focus:border-[#FF4460] focus:outline-none"
                  options={categories.map((c) => ({ label: c.name, value: c.name }))}
                  defaultValue={
                    editingSubCategory?.category ?? categories[0]?.name ?? ""
                  }
                />
              </div>

              <div className="flex flex-col gap-2 col-span-1">
                <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">Service For</label>
                <Select
                  name="serviceFor"
                  className="h-10 w-full rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] focus:border-[#FF4460] focus:outline-none"
                  options={[
                    { label: "For All", value: "all" },
                  ]}
                  defaultValue={editingSubCategory?.serviceFor === "For All" ? "all" : "all"}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="brand" type="submit">
              {editingSubCategory ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
