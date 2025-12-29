import React, { useState, useEffect } from "react";
import { BarChart3, Clock, CheckCircle2 } from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import { useAuth } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";

/**
 * Component hiển thị và vote poll
 * Props:
 * - pollId: number - ID của poll
 * - expiresAt?: string - Thời gian hết hạn (ISO string)
 * - options: Array<{id: number, text: string}> - Các options
 * - userVotedOptionId?: number | null - ID của option user đã vote (từ backend)
 * - onVoteSuccess?: () => void - Callback sau khi vote thành công
 */
const PollDisplay = ({
  pollId,
  expiresAt,
  options = [],
  userVotedOptionId = null,
  onVoteSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [results, setResults] = useState(null);
  const [voting, setVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState(userVotedOptionId);
  const [hasVotedThisSession, setHasVotedThisSession] = useState(false);

  // Derived state từ prop
  const hasVoted = selectedOptionId !== null;
  const votedOptionId = selectedOptionId;

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  const fetchResults = async () => {
    try {
      const response = await axiosInstance.get(`/poll/${pollId}/result`);
      setResults(response.data);
    } catch (error) {
      console.error("Failed to fetch poll results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Auto-refresh results every 30 seconds nếu chưa vote
    if (!hasVoted && !isExpired) {
      const interval = setInterval(fetchResults, 30000);
      return () => clearInterval(interval);
    }
  }, [pollId, hasVoted, isExpired]);

  // Sync selectedOptionId với prop userVotedOptionId khi component mount hoặc prop thay đổi
  useEffect(() => {
    setSelectedOptionId(userVotedOptionId);
  }, [userVotedOptionId]);

  const handleVote = async (optionId) => {
    if (!currentUser) {
      showError("Vui lòng đăng nhập để bình chọn");
      return;
    }

    if (isExpired) {
      showError("Poll đã hết hạn");
      return;
    }

    setVoting(true);
    try {
      const response = await axiosInstance.post(`/poll/${pollId}/vote`, {
        optionId,
      });

      const { action } = response.data;

      // Xử lý theo action từ backend
      switch (action) {
        case "vote":
          // Vote lần đầu
          setSelectedOptionId(response.data.pollOptionId);
          setHasVotedThisSession(true);
          showSuccess("Bình chọn thành công!");
          break;

        case "change":
          // Đổi lựa chọn
          setSelectedOptionId(response.data.pollOptionId);
          setHasVotedThisSession(true);
          showSuccess("Đã cập nhật lựa chọn của bạn!");
          break;

        case "unvote":
          // Bỏ chọn
          setSelectedOptionId(null);
          setHasVotedThisSession(false);
          showSuccess("Đã hủy bình chọn!");
          break;

        default:
          console.warn("Unknown action:", action);
      }

      // Refresh poll results để cập nhật vote count
      await fetchResults();

      // Gọi callback để parent refetch post data
      onVoteSuccess?.();
    } catch (error) {
      console.error("Failed to vote:", error);
      const message =
        error.response?.data?.message ||
        "Không thể bình chọn. Vui lòng thử lại.";
      showError(message);
    } finally {
      setVoting(false);
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-2 text-gray-500">
          <BarChart3 size={20} className="animate-pulse" />
          <span className="text-sm">Đang tải poll...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const totalVotes = results.totalVotes || 0;
  const showResults = hasVoted || isExpired || hasVotedThisSession;

  return (
    <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Poll Bình Chọn</h3>
            <p className="text-xs text-gray-600">{totalVotes} phiếu bầu</p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {isExpired && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
              <Clock size={14} />
              Đã hết hạn
            </span>
          )}
          {hasVoted && !isExpired && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 size={14} />
              Đã bình chọn
            </span>
          )}
        </div>
      </div>

      {/* Expiry info */}
      {expiresAt && !isExpired && (
        <div className="mb-4 text-xs text-gray-600 flex items-center gap-1">
          <Clock size={14} />
          <span>Hết hạn: {formatExpiryDate(expiresAt)}</span>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {results.options.map((option) => {
          const percentage = option.percentage || 0;
          const isVoted = votedOptionId === option.id;

          return (
            <div key={option.id} className="relative">
              {showResults ? (
                // Results Mode - Show progress bar (clickable to change vote)
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={voting || !currentUser || isExpired}
                  className={`relative w-full overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    isVoted
                      ? "border-green-400 bg-white shadow-md hover:shadow-lg"
                      : "border-gray-300 bg-white hover:border-purple-300 hover:shadow-sm"
                  } ${voting || !currentUser || isExpired ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {/* Progress bar background */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      isVoted
                        ? "bg-gradient-to-r from-green-100 to-green-50"
                        : "bg-gradient-to-r from-purple-100 to-pink-50"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Content */}
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {isVoted && (
                        <CheckCircle2
                          size={20}
                          className="text-green-600 flex-shrink-0"
                        />
                      )}
                      <span
                        className={`font-medium ${
                          isVoted ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm text-gray-600">
                        {option.votes} phiếu
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isVoted ? "text-green-600" : "text-purple-600"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </button>
              ) : (
                // Vote Mode - Show buttons
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={voting || !currentUser}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-medium text-left transition-all duration-200 ${
                    isVoted
                      ? "border-green-500 bg-green-50 hover:border-green-600 hover:bg-green-100"
                      : voting
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                      : "border-purple-300 bg-white hover:border-purple-500 hover:bg-purple-50 hover:shadow-md transform hover:scale-[1.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isVoted && (
                        <CheckCircle2 size={18} className="text-green-600" />
                      )}
                      <span className={isVoted ? "text-green-900" : "text-gray-900"}>
                        {option.text}
                      </span>
                    </div>
                    {totalVotes > 0 && (
                      <span className="text-xs text-gray-500">
                        {option.votes} phiếu ({percentage}%)
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      {!currentUser && !showResults && (
        <div className="mt-4 pt-3 border-t border-purple-200">
          <p className="text-sm text-center text-gray-600">
            🔒 Đăng nhập để bình chọn
          </p>
        </div>
      )}

      {showResults && isExpired && (
        <div className="mt-4 pt-3 border-t border-purple-200">
          <p className="text-xs text-center text-gray-500 italic">
            Poll đã kết thúc vào {formatExpiryDate(expiresAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PollDisplay;
