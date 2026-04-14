import { useRef, useState } from "react";
import * as Yup from "yup";
import themes from "../context/Theme";

export default function useCreateEventForm() {
  // UI States
  const [openImageModal, setOpenImageModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [pricingModal, setPricingModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  // Event States
  const [visibility, setVisibility] = useState("Public");
  const [location, setLocation] = useState("");

  const [category, setCategory] = useState("");

  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const debounceRef = useRef(null);

  // ================= VALIDATION =================
  const validationSchema = Yup.object({
    eventName: Yup.string().required("Event name is required"),
    startDate: Yup.string().required("Start date required"),
    endDate: Yup.string().required("End date required"),
    location: Yup.string().required("Location required"),
    category: Yup.string().required("Category required"),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { eventName, startDate, endDate, location, category },
        { abortEarly: false }
      );

      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });

      setErrors(newErrors);
      return false;
    }
  };

  return {
    // UI
    openImageModal,
    setOpenImageModal,
    drawerOpen,
    setDrawerOpen,
    selectedTheme,
    setSelectedTheme,
    anchorEl,
    setAnchorEl,
    openMenu,
    pricingModal,
    setPricingModal,
    authModal,
    setAuthModal,

    // Event
    visibility,
    setVisibility,
    location,
    setLocation,
    category,
    setCategory,
    eventName,
    setEventName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,

    // Utils
    debounceRef,
    loading,
    setLoading,
    errors,
    setErrors,
    validateForm,
  };
}