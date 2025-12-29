import React, { useState, useRef, useEffect } from "react";
import { Eye, Users, Lock, X } from "lucide-react";
import PrivacySelector from "./PrivacySelector";

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
 * Component nút icon quyền riêng tư với dropdown
 * Props:
 * - value: string (PUBLIC, FOLLOWERS, PRIVATE, ANONYMOUS)
 * - onChange: (value: string) => void
 */
const PrivacyButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.target)
      ) {
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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={selectedOption.label}
      >
        <Icon size={20} className={selectedOption.color} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-0 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Quyền riêng tư
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-2">
            <PrivacySelector value={value} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyButton;
