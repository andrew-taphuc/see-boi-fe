import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import TiptapEditor from "@components/richtext/TiptapEditor";
import PollForm from "@components/posts/PollForm";
import PrivacyButton from "@components/posts/PrivacyButton";
import ImageUpload from "@components/posts/ImageUpload";
import TagSelector from "@components/posts/TagSelector";
import { useAuth } from "@context/AuthContext";

/**
 * Helper function để extract tất cả image URLs từ contentJson (ProseMirror JSON)
 * @param {object} contentJson - ProseMirror JSON document
 * @returns {string[]} - Mảng các image URLs (loại bỏ data URLs)
 */
const extractImageUrls = (contentJson) => {
  if (!contentJson || !contentJson.content) {
    return [];
  }

  const imageUrls = [];

  const traverse = (node) => {
    if (node.type === "image" && node.attrs?.src) {
      const src = node.attrs.src;
      // Chỉ lấy URLs thật, bỏ qua data URLs (base64)
      if (src && !src.startsWith("data:")) {
        imageUrls.push(src);
      }
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  traverse(contentJson);
  return imageUrls;
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [contentJson, setContentJson] = useState(null);
  const [contentText, setContentText] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollExpiresAt, setPollExpiresAt] = useState(""); // yyyy-MM-ddThh:mm (local)

  // Thumbnail: có thể là file (ảnh mới) hoặc URL (ảnh cũ)
  const [thumbnail, setThumbnail] = useState(null); // File object nếu là ảnh mới
  const [thumbnailUrl, setThumbnailUrl] = useState(null); // URL string nếu là ảnh cũ
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Preview URL để hiển thị

  // Tags
  const [selectedTags, setSelectedTags] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      const postId = parseInt(id);
      if (!postId || Number.isNaN(postId)) {
        setErrorMsg("ID bài viết không hợp lệ");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMsg("");

      try {
        // Load post data
        const postRes = await axiosInstance.get(`/post/${postId}`);
        const post = postRes.data;

        // Kiểm tra quyền: chỉ chủ bài viết mới được edit
        if (post.userId !== currentUser?.id) {
          setErrorMsg("Bạn không có quyền chỉnh sửa bài viết này");
          setIsLoading(false);
          return;
        }

        // Parse contentJson nếu là string
        let parsedContentJson = post.contentJson;
        if (parsedContentJson && typeof parsedContentJson === "string") {
          try {
            parsedContentJson = JSON.parse(parsedContentJson);
          } catch (e) {
            console.error("Error parsing contentJson:", e);
            parsedContentJson = null;
          }
        }

        // Pre-fill form
        setTitle(post.title || "");
        setContentJson(parsedContentJson);
        setContentText(post.contentText || "");
        setVisibility(post.visibility || "PUBLIC");

        // Pre-fill thumbnail
        if (post.thumbnailUrl) {
          setThumbnailUrl(post.thumbnailUrl);
          setThumbnailPreview(post.thumbnailUrl);
        }

        // Pre-fill tags
        if (post.tags && Array.isArray(post.tags)) {
          const tagIds = post.tags
            .map((tag) => tag.tagId || tag.id)
            .filter(Boolean);
          setSelectedTags(tagIds);
        }

        // Pre-fill poll nếu có
        if (post.type === "POLL" && post.poll) {
          setIsPoll(true);
          const options = post.poll.options || [];
          // Extract optionText từ objects nếu cần
          const optionTexts = options.map((opt) =>
            typeof opt === "string" ? opt : opt.optionText || opt.text || ""
          );
          setPollOptions(optionTexts.length > 0 ? optionTexts : ["", ""]);
          if (post.poll.expiresAt) {
            // Convert ISO string to local datetime string
            const expiresDate = new Date(post.poll.expiresAt);
            const localDate = new Date(expiresDate.getTime() - expiresDate.getTimezoneOffset() * 60000);
            setPollExpiresAt(localDate.toISOString().slice(0, 16));
          }
        }

        // Load images (optional, để hiển thị thông tin)
        try {
          const imagesRes = await axiosInstance.get(`/post/${postId}/images`);
          console.log("Current post images:", imagesRes.data);
        } catch (imageError) {
          console.warn("Could not load post images:", imageError);
          // Không bắt buộc, có thể post chưa có images
        }
      } catch (e) {
        console.error("Error loading post:", e);
        setErrorMsg(
          e?.response?.data?.message || "Không thể tải bài viết. Vui lòng thử lại."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      loadPost();
    }
  }, [id, currentUser]);

  useMemo(() => {
    const hasPollContent = isPoll && pollOptions.some((o) => (o || "").trim());
    return (
      !!title.trim() ||
      !!contentText.trim() ||
      visibility !== "PUBLIC" ||
      hasPollContent ||
      !!pollExpiresAt ||
      !!thumbnail ||
      !!thumbnailUrl
    );
  }, [
    title,
    contentText,
    visibility,
    isPoll,
    pollOptions,
    pollExpiresAt,
    thumbnail,
    thumbnailUrl,
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

    // Nếu có thumbnail mới (file), tạo FormData
    if (thumbnail) {
      const formData = new FormData();

      // Thêm thumbnail file
      formData.append("thumbnail", thumbnail);

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

    // Nếu không có thumbnail mới nhưng có thumbnailUrl cũ, gửi thumbnailUrl
    if (thumbnailUrl && !thumbnail) {
      payload.thumbnailUrl = thumbnailUrl;
    }

    // Thêm tagIds vào payload
    if (selectedTags.length > 0) {
      payload.tagIds = selectedTags;
    }

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    return payload;
  };

  const submitPost = async ({ draft }) => {
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề.");
      return;
    }

    // Validate thumbnail: phải có thumbnail (file mới hoặc URL cũ)
    if (!thumbnail && !thumbnailUrl) {
      setErrorMsg("Vui lòng chọn ảnh đại diện cho bài đăng.");
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
      const postId = parseInt(id);

      // Update post
      await axiosInstance.patch(`/post/${postId}`, payload);
      

      // Extract image URLs từ contentJson
      const imageUrls = extractImageUrls(contentJson);

      // Update images (backend sẽ tự động sync)
      if (imageUrls.length > 0) {
        try {
          const userId = currentUser?.id;
          if (userId) {
            await axiosInstance.post(`/post/${postId}/images`, {
              imageUrls,
              postId,
              userId,
            });
          }
        } catch (imageError) {
          console.error("Lỗi khi cập nhật link ảnh:", imageError);
          // Không throw error vì post đã được update thành công
        }
      } else {
        // Nếu không còn ảnh nào, gửi mảng rỗng để xóa tất cả
        try {
          const userId = currentUser?.id;
          if (userId) {
            await axiosInstance.post(`/post/${postId}/images`, {
              imageUrls: [],
              postId,
              userId,
            });
          }
        } catch (imageError) {
          console.error("Lỗi khi xóa ảnh:", imageError);
        }
      }

      // Sau khi update xong: điều hướng về chi tiết bài viết
      navigate(`/post/${postId}`);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || "Cập nhật bài viết thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryLeave = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !title) {
    // Error khi load post
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
          <button
            onClick={tryLeave}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
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

        {/* Thumbnail Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon size={16} />
            Ảnh đại diện (Thumbnail)
            <span className="text-red-500">*</span>
          </label>
          <ImageUpload
            imageUrl={thumbnailPreview}
            onImageChange={(file) => {
              setThumbnail(file); // Lưu file mới
              setThumbnailUrl(null); // Xóa URL cũ
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
              setThumbnailUrl(null);
              setThumbnailPreview(null);
            }}
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
            <span>Cập nhật</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
