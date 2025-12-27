import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import TiptapEditor from "@components/richtext/TiptapEditor";
import PollForm from "@components/posts/PollForm";
import PrivacyButton from "@components/posts/PrivacyButton";
import ImageUpload from "@components/posts/ImageUpload";
import MultiImageUpload from "@components/common/MultiImageUpload";
import TagSelector from "@components/posts/TagSelector";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [contentJson, setContentJson] = useState(null);
  const [contentText, setContentText] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollExpiresAt, setPollExpiresAt] = useState(""); // yyyy-MM-ddThh:mm (local)
  // Thumbnail (ảnh đại diện)
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Content images (ảnh trong bài viết)
  const [contentImages, setContentImages] = useState([]);

  // Tags
  const [selectedTags, setSelectedTags] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useMemo(() => {
    const hasPollContent = isPoll && pollOptions.some((o) => (o || "").trim());
    return (
      !!title.trim() ||
      !!contentText.trim() ||
      visibility !== "PUBLIC" ||
      hasPollContent ||
      !!pollExpiresAt ||
      !!thumbnail ||
      contentImages.length > 0
    );
  }, [
    title,
    contentText,
    visibility,
    isPoll,
    pollOptions,
    pollExpiresAt,
    thumbnail,
    contentImages,
  ]);

  const normalizePollOptions = () => {
    const normalized = pollOptions.map((o) => (o || "").trim());
    while (normalized.length > 2 && !normalized[normalized.length - 1])
      normalized.pop();
    return normalized;
  };

  const validatePoll = () => {
    const normalized = normalizePollOptions();
    const nonEmpty = normalized.filter(Boolean);
    if (nonEmpty.length < 2) return "Vote cần tối thiểu 2 lựa chọn.";
    if (nonEmpty.length > 10) return "Vote tối đa 10 lựa chọn.";
    const lower = nonEmpty.map((x) => x.toLowerCase());
    const unique = new Set(lower);
    if (unique.size !== lower.length)
      return "Các lựa chọn vote không được trùng nhau.";
    return "";
  };

  const buildPayload = (draft) => {
    const type = isPoll ? "POLL" : "NORMAL";
    const payload = {
      title: title.trim() || undefined,
      contentJson: contentJson || undefined,
      contentText: contentText.trim() || undefined,
      type,
      visibility,
      isDraft: !!draft,
    };

    if (isPoll) {
      const normalized = normalizePollOptions();
      const nonEmpty = normalized.filter(Boolean);
      payload.poll = {
        options: nonEmpty,
        expiresAt: pollExpiresAt
          ? new Date(pollExpiresAt).toISOString()
          : undefined,
      };
    }

    // Nếu có thumbnail hoặc content images, tạo FormData
    if (thumbnail || contentImages.length > 0) {
      const formData = new FormData();

      // Thêm thumbnail
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Thêm content images
      contentImages.forEach((file) => {
        formData.append("images", file);
      });

      // Thêm các field khác vào FormData
      if (payload.title) formData.append("title", payload.title);
      if (payload.contentJson)
        formData.append("contentJson", JSON.stringify(payload.contentJson));
      if (payload.contentText)
        formData.append("contentText", payload.contentText);
      formData.append("type", payload.type);
      formData.append("visibility", payload.visibility);
      formData.append("isDraft", payload.isDraft.toString());

      if (payload.poll) {
        formData.append("poll", JSON.stringify(payload.poll));
      }

      // Thêm tagIds
      selectedTags.forEach((tagId) => {
        formData.append("tagIds", tagId);
      });

      return formData;
    }

    return payload;
  };

  const submitPost = async ({ draft }) => {
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề.");
      return;
    }

    // Validate thumbnail bắt buộc
    if (!thumbnail) {
      setErrorMsg("Vui lòng chọn ảnh đại diện cho bài đăng.");
      // Scroll to thumbnail section
      setTimeout(() => {
        document
          .querySelector('[class*="Thumbnail"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    if (contentJson) {
      try {
        const size = new TextEncoder().encode(
          JSON.stringify(contentJson)
        ).length;
        if (size > 200 * 1024) {
          setErrorMsg("Nội dung quá dài (vượt 200KB). Vui lòng rút gọn.");
          return;
        }
      } catch {
        setErrorMsg("Nội dung không hợp lệ.");
        return;
      }
    }

    if (isPoll) {
      const pollErr = validatePoll();
      if (pollErr) {
        setErrorMsg(pollErr);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload(draft);

      // Không cần set Content-Type header, axiosInstance sẽ tự động xử lý FormData
      const res = await axiosInstance.post("/post", payload);
      // Sau khi tạo xong: điều hướng về chi tiết bài viết
      navigate(`/post/${res.data?.id}`);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || "Tạo bài viết thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryLeave = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={tryLeave}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Đăng bài viết</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 relative">
        {/* Privacy Button ở góc trên phải */}
        <div className="absolute top-5 right-5">
          <PrivacyButton value={visibility} onChange={setVisibility} />
        </div>

        {!!errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="mb-3">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border-none outline-none text-2xl font-bold text-gray-900 focus:outline-none"
            placeholder="Nhập tiêu đề"
          />
        </div>

        {/* Thumbnail Upload - BẮT BUỘC */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon size={16} />
            Ảnh đại diện (Thumbnail)
            <span className="text-red-500">*</span>
          </label>
          {!thumbnail}
          <ImageUpload
            imageUrl={thumbnailPreview}
            onImageChange={(file) => {
              setThumbnail(file);
              setErrorMsg(""); // Clear error khi chọn ảnh
              // Tạo preview URL
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setThumbnailPreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            onImageRemove={() => {
              setThumbnail(null);
              setThumbnailPreview(null);
            }}
          />
        </div>

        {/* Content Images Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh trong bài viết (tối đa 10 ảnh)
          </label>
          <MultiImageUpload
            images={contentImages}
            onImagesChange={setContentImages}
            maxImages={10}
          />
        </div>

        {/* Tag Selector */}
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        <div className="mb-3">
          <TiptapEditor
            valueJson={contentJson}
            onChange={({ json, text }) => {
              setContentJson(json);
              setContentText(text || "");
            }}
            onPollSuggestion={() => {
              setIsPoll(true);
              setErrorMsg("");
            }}
          />
        </div>

        {isPoll && (
          <PollForm
            pollOptions={pollOptions}
            onPollOptionsChange={setPollOptions}
            pollExpiresAt={pollExpiresAt}
            onPollExpiresAtChange={setPollExpiresAt}
            onCancel={() => {
              setIsPoll(false);
              setPollOptions(["", ""]);
              setPollExpiresAt("");
            }}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={tryLeave}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => submitPost({ draft: true })}
            className={`px-4 py-2 rounded-lg text-sm ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Lưu nháp
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => submitPost({ draft: false })}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              isSubmitting
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
            <span>Đăng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
