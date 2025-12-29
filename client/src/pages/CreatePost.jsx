import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Loader2,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  BarChart3,
  FileText,
  Save,
} from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import TiptapEditor from "@components/richtext/TiptapEditor";
import PollForm from "@components/posts/PollForm";
import PrivacyButton from "@components/posts/PrivacyButton";
import ImageUpload from "@components/posts/ImageUpload";
import TagSelector from "@components/posts/TagSelector";
import { useToast } from "@context/ToastContext";

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

const CreatePost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftIdParam = searchParams.get("draftId"); // Nếu đang edit draft
  const { showToast } = useToast();

  const [draftId, setDraftId] = useState(
    draftIdParam ? parseInt(draftIdParam) : null
  );
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

  // Tags
  const [selectedTags, setSelectedTags] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

  // Load draft nếu có draftId
  useEffect(() => {
    if (draftId) {
      loadDraft(draftId);
    }
  }, [draftId]);

  const loadDraft = async (id) => {
    try {
      // Load draft từ danh sách drafts của user (vì backend không cho GET /post/:id với draft)
      const response = await axiosInstance.get(`/post/drafts/me`);
      const drafts = response.data;
      const draft = drafts.find((d) => d.id === id);

      if (!draft) {
        showToast("Không tìm thấy bản nháp này", "error");
        navigate("/post/create");
        return;
      }

      // Kiểm tra xem có phải draft không
      if (!draft.isDraft) {
        showToast("Bài viết này không phải là bản nháp", "error");
        navigate("/post/create");
        return;
      }

      setTitle(draft.title || "");
      setVisibility(draft.visibility || "PUBLIC");
      setIsPoll(draft.type === "POLL");

      // Parse contentJson nếu là string
      let parsedContentJson = draft.contentJson;
      if (parsedContentJson && typeof parsedContentJson === "string") {
        try {
          parsedContentJson = JSON.parse(parsedContentJson);
        } catch (e) {
          console.error("Error parsing contentJson:", e);
          parsedContentJson = null;
        }
      }
      setContentJson(parsedContentJson);
      setContentText(draft.contentText || "");

      // Load thumbnail
      if (draft.thumbnailUrl) {
        setThumbnailPreview(draft.thumbnailUrl);
      }

      // Load tags
      if (draft.tags && draft.tags.length > 0) {
        setSelectedTags(draft.tags.map((tag) => tag.id));
      }

      // Load poll data nếu có
      if (draft.type === "POLL" && draft.poll) {
        setPollOptions(draft.poll.options || ["", ""]);
        if (draft.poll.expiresAt) {
          // Convert ISO to local datetime
          const date = new Date(draft.poll.expiresAt);
          const localDateTime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16);
          setPollExpiresAt(localDateTime);
        }
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error("Error loading draft:", error);
      showToast("Không thể tải bản nháp", "error");
      navigate("/post/create");
    }
  };

  useMemo(() => {
    const hasPollContent = isPoll && pollOptions.some((o) => (o || "").trim());
    return (
      !!title.trim() ||
      !!contentText.trim() ||
      visibility !== "PUBLIC" ||
      hasPollContent ||
      !!pollExpiresAt ||
      !!thumbnail
    );
  }, [
    title,
    contentText,
    visibility,
    isPoll,
    pollOptions,
    pollExpiresAt,
    thumbnail,
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

    // Thêm tagIds vào payload
    if (selectedTags.length > 0) {
      payload.tagIds = selectedTags;
    }

    // Nếu có thumbnail (file mới), tạo FormData
    if (thumbnail) {
      const formData = new FormData();

      // Thêm thumbnail
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

      // Thêm tagIds vào FormData
      if (payload.tagIds) {
        payload.tagIds.forEach((tagId) => {
          formData.append("tagIds", tagId);
        });
      }

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

    // Validate thumbnail bắt buộc (chỉ cho Normal Post khi publish, Poll tự động có thumbnail)
    if (!draft && !isPoll && !thumbnail && !thumbnailPreview) {
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

    // Set loading state dựa trên draft hay publish
    if (draft) {
      setIsSavingDraft(true);
    } else {
      setIsSubmitting(true);
    }
    try {
      const payload = buildPayload(draft);

      let res;
      if (draftId && draft) {
        // Cập nhật draft hiện tại
        res = await axiosInstance.patch(`/post/${draftId}`, payload);
        showToast("Đã cập nhật bản nháp", "success");
        // Redirect sang trang drafts sau khi cập nhật
        navigate("/drafts");
        return;
      } else if (draftId && !draft) {
        // Publish draft hiện tại
        // Trước tiên update draft với thông tin mới nhất (nếu có thay đổi)
        const patchConfig = {};
        // Nếu payload là FormData (có file mới), không set Content-Type để browser tự set multipart/form-data
        if (!(payload instanceof FormData)) {
          patchConfig.headers = { "Content-Type": "application/json" };
        }
        await axiosInstance.patch(`/post/${draftId}`, payload, patchConfig);
        // Sau đó publish
        res = await axiosInstance.patch(
          `/post/${draftId}/publish`,
          { isDraft: false },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        showToast("Đã đăng bài viết thành công! 🎉", "success");
      } else {
        // Tạo mới (draft hoặc post)
        res = await axiosInstance.post("/post", payload);
        if (draft) {
          // Lưu draft thành công
          if (!res.data?.id) {
            throw new Error("Không nhận được ID bài viết từ server");
          }
          showToast("Đã lưu bản nháp", "success");
          navigate("/drafts");
          return;
        } else {
          // Publish post mới
          showToast("Đã đăng bài viết thành công! 🎉", "success");
        }
      }

      // Các bước sau chỉ dành cho publish post
      const postId = res.data?.id;

      if (!postId) {
        throw new Error("Không nhận được ID bài viết từ server");
      }

      // Extract image URLs từ contentJson
      const imageUrls = extractImageUrls(contentJson);

      // Nếu có ảnh trong content, gọi API để lưu link ảnh
      if (imageUrls.length > 0) {
        try {
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
          );
          const userId = currentUser?.id;

          if (!userId) {
            console.warn("Không tìm thấy userId, bỏ qua việc lưu link ảnh");
          } else {
            await axiosInstance.post(`/post/${postId}/images`, {
              imageUrls,
              postId,
              userId,
            });
          }
        } catch (imageError) {
          console.error("Lỗi khi lưu link ảnh:", imageError);
        }
      }

      // Sau khi publish xong: điều hướng về chi tiết bài viết
      navigate(`/post/${postId}`);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
      showToast(e?.response?.data?.message || "Có lỗi xảy ra", "error");
    } finally {
      if (draft) {
        setIsSavingDraft(false);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const saveDraft = async () => {
    if (!title.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề.");
      showToast("Vui lòng nhập tiêu đề trước khi lưu nháp", "warning");
      return;
    }

    await submitPost({ draft: true });
  };

  const tryLeave = () => {
    if (draftId) {
      navigate("/drafts");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={tryLeave}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {draftId ? "Chỉnh sửa bản nháp" : "Đăng bài viết"}
          </h1>
        </div>
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Đã lưu lúc {lastSaved.toLocaleTimeString()}
          </p>
        )}
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

        {/* Toggle Post Type - Normal hoặc Poll */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại bài viết
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPoll(false);
                setPollOptions(["", ""]);
                setPollExpiresAt("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                !isPoll
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <FileText size={20} />
              <span className="font-medium">Bài viết thường</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPoll(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                isPoll
                  ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Poll bình chọn</span>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border-none outline-none text-2xl font-bold text-gray-900 focus:outline-none"
            placeholder="Nhập tiêu đề"
          />
        </div>

        {/* Thumbnail Upload - CHỈ cho bài viết thường, Poll tự động tạo */}
        {!isPoll ? (
          <div className="mb-3">
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <ImageIcon size={16} />
              Ảnh đại diện (Thumbnail)
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500">
                (bắt buộc khi đăng bài)
              </span>
            </label>
            <ImageUpload
              imageUrl={thumbnailPreview}
              onImageChange={(file) => {
                setThumbnail(file);
                setErrorMsg("");
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
        ) : (
          <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-700 flex items-center gap-2">
              <ImageIcon size={16} />
              <span>
                Poll sẽ tự động tạo ảnh đại diện. Bạn không cần upload
                thumbnail.
              </span>
            </p>
          </div>
        )}

        {/* Tag Selector */}
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        {/* Poll Form - Hiển thị khi chọn Poll mode */}
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

        {/* Content Editor - Optional cho Poll, bắt buộc cho normal post */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung{" "}
            {isPoll && (
              <span className="text-gray-500 text-xs">(tùy chọn cho Poll)</span>
            )}
          </label>
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
            disabled={isSavingDraft}
            onClick={saveDraft}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              isSavingDraft
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            {isSavingDraft ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>Lưu nháp</span>
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
            <span>{draftId ? "Đăng bài" : "Đăng"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
