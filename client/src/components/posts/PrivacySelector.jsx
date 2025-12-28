import React, { useState, useRef, useEffect } from "react";
import { Eye, Users, Lock } from "lucide-react";

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Công khai", icon: Eye, color: "text-green-600" },
  {
    value: "FOLLOWERS",
    label: "Người theo dõi",
    icon: Users,
    color: "text-blue-600",
  },
  {
    value: "PRIVATE",
    label: "Chỉ mình tôi",
    icon: Lock,
    color: "text-gray-600",
  },
];

/**
 * Component chọn quyền riêng tư
 * Props:
 * - value: string (PUBLIC, FOLLOWERS, PRIVATE, ANONYMOUS)
 * - onChange: (value: string) => void
 */
const PrivacySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption =
    VISIBILITY_OPTIONS.find((opt) => opt.value === value) ||
    VISIBILITY_OPTIONS[0];
  const Icon = selectedOption.icon;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {VISIBILITY_OPTIONS.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isSelected
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              } ${
                option.value !==
                VISIBILITY_OPTIONS[VISIBILITY_OPTIONS.length - 1].value
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <OptionIcon size={18} className={option.color} />
              <span className="flex-1 text-left">{option.label}</span>
              {isSelected && (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PrivacySelector;
