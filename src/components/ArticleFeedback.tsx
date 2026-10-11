'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  LifeBuoy, 
  SearchCheck, 
  HelpCircle,
  MessageSquareHeart,
} from "lucide-react";

interface ArticleFeedbackProps {
  articleTitle?: string;
}

const FEEDBACK_REASONS = [
  "Thao tác thực tế khác hướng dẫn",
  "Gặp lỗi khi bấm lưu / xuất bản",
  "Thiếu hình ảnh hoặc sơ đồ mẫu",
  "Chưa tìm thấy đúng mục tiêu cần làm",
  "Nội dung khó hiểu hoặc quá dài",
];

export function ArticleFeedback({ articleTitle }: ArticleFeedbackProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState<boolean>(false);
  const [voted, setVoted] = useState<"helpful" | "unhelpful" | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customComment, setCustomComment] = useState<string>("");
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);

  const storageKey = `techdoc_feedback_${pathname || "general"}`;

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type === "helpful") {
          setVoted("helpful");
        } else if (parsed.type === "unhelpful") {
          setVoted("unhelpful");
          if (parsed.reason || parsed.comment) {
            setSelectedReason(parsed.reason || "");
            setCustomComment(parsed.comment || "");
            setSubmittedFeedback(true);
          }
        }
      }
    } catch (_) {}
  }, [storageKey]);

  const handleVote = (type: "helpful" | "unhelpful") => {
    setVoted(type);
    if (type === "helpful") {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            type: "helpful",
            title: articleTitle,
            path: pathname,
            date: new Date().toISOString(),
          })
        );
      } catch (_) {}
    }
  };

  const handleReset = () => {
    setVoted(null);
    setSelectedReason("");
    setCustomComment("");
    setSubmittedFeedback(false);
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {}
  };

  const handleSubmitNegative = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedFeedback(true);
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          type: "unhelpful",
          title: articleTitle,
          path: pathname,
          reason: selectedReason,
          comment: customComment,
          date: new Date().toISOString(),
        })
      );
    } catch (_) {}
  };

  // Đảm bảo SSR render khung mặc định giúp tăng tốc độ hiển thị và tương thích SEO

  return (
    <div className="no-print mt-12 mb-8 pt-8 border-t border-border/70">
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-7 backdrop-blur-xs transition-all shadow-2xs">
        
        {/* TRẠNG THÁI 1: CHƯA ĐÁNH GIÁ (IDLE) */}
        {!voted && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <MessageSquareHeart className="size-3.5" />
                <span>Đánh giá bài viết</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                Bài hướng dẫn này có giúp Thầy/Cô hoàn thành công việc không?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Ý kiến phản hồi giúp Ban Quản trị hoàn thiện tài liệu phục vụ Thầy/Cô tốt hơn.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleVote("helpful")}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ThumbsUp className="size-4 transition-transform group-hover:-translate-y-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>Hữu ích, đã làm được</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote("unhelpful")}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ThumbsDown className="size-4 transition-transform group-hover:translate-y-0.5 text-rose-600 dark:text-rose-400" />
                <span>Chưa làm được / Cần hỗ trợ</span>
              </button>
            </div>
          </div>
        )}

        {/* TRẠNG THÁI 2: ĐÃ ĐÁNH GIÁ LÀ HỮU ÍCH */}
        {voted === "helpful" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
            <div className="flex items-start sm:items-center gap-3">
              <div className="size-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground">
                  Cảm ơn Thầy/Cô đã phản hồi hữu ích! 🎉
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Đánh giá của Thầy/Cô đã được ghi nhận. Chúc Thầy/Cô thao tác thuận lợi và hoàn thành công việc nhanh chóng!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer shrink-0 self-start sm:self-center"
            >
              <RotateCcw className="size-3.5" />
              <span>Thay đổi ý kiến</span>
            </button>
          </div>
        )}

        {/* TRẠNG THÁI 3: CHƯA LÀM ĐƯỢC - MỞ FORM GÓP Ý & ĐIỀU HƯỚNG HỖ TRỢ */}
        {voted === "unhelpful" && (
          <div>
            {!submittedFeedback ? (
              <form onSubmit={handleSubmitNegative} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                      <HelpCircle className="size-4 text-amber-500" />
                      <span>Xin Thầy/Cô bớt chút thời gian cho biết khó khăn gặp phải:</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ban Quản trị sẽ đối soát và cập nhật lại bài viết để các Thầy/Cô thao tác dễ dàng hơn.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    <span>Hủy</span>
                  </button>
                </div>

                {/* Danh sách lựa chọn nhanh */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {FEEDBACK_REASONS.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedReason(reason === selectedReason ? "" : reason)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedReason === reason
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {/* Nhập ghi chú chi tiết */}
                <div>
                  <textarea
                    rows={2}
                    value={customComment}
                    onChange={(e) => setCustomComment(e.target.value)}
                    placeholder="Thầy/Cô có thể ghi chú ngắn gọn bước gặp khó khăn (không bắt buộc)..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-2xs"
                  >
                    <Send className="size-3.5" />
                    <span>Gửi ý kiến đóng góp</span>
                  </button>

                  <div className="text-xs text-muted-foreground">
                    Thầy/Cô cũng có thể tra cứu nhanh trong <strong>Trung tâm xử lý sự cố</strong> bên dưới.
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Ban Quản trị đã nhận được góp ý của Thầy/Cô!
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Chúng tôi sẽ kiểm tra lại nội dung bài viết và quy trình hệ thống để cập nhật hoàn thiện.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer shrink-0"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Gửi lại ý kiến</span>
                </button>
              </div>
            )}

            {/* CẦU NỐI HỖ TRỢ KHẨN CẤP KHI THẦY CÔ CHƯA LÀM ĐƯỢC */}
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 text-foreground transition-all group"
              >
                <div className="size-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <SearchCheck className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                    <span>Trung tâm xử lý 7 sự cố thường gặp</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Bài chưa hiện, lỗi tải PDF, khôi phục bài viết...
                  </div>
                </div>
              </Link>

              <Link
                href="/docs/06-kiem-tra-va-tro-ly/03-kenh-gop-y-va-ho-tro-truc-tuyen"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 text-foreground transition-all group"
              >
                <div className="size-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <LifeBuoy className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                    <span>Gửi phiếu yêu cầu hỗ trợ (Ticket)</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Chuyên viên kỹ thuật Ban Quản trị hỗ trợ trực tiếp
                  </div>
                </div>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
