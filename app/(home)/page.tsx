import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#0072BC] dark:text-sky-400 text-xs sm:text-sm font-semibold mb-6">
        <span>🏛️ Trường ĐH Sư phạm Kỹ thuật TP.HCM</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl mb-6">
        Cổng Hướng Dẫn Quản Trị Website <span className="text-[#0072BC] dark:text-sky-400">HCM-UTE</span>
      </h1>

      <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed">
        Tài liệu số hóa quy trình chuẩn: Xây dựng sơ đồ trang, cây chuyên mục tin tức, phân phối bài viết và cấu hình thanh điều hướng.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition transform active:scale-95"
        >
          <span>Khám phá tài liệu ngay</span>
          <span>→</span>
        </Link>
        <Link
          href="/docs/01-tong-quan/02-luong-hanh-dong-co-ban"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-base transition"
        >
          <span>Xem Luồng hành động</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
        <Link
          href="/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang"
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#0072BC] dark:hover:border-sky-500 bg-white dark:bg-slate-900 transition shadow-sm hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#0072BC] font-bold mb-4 group-hover:scale-110 transition">
            A
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Luồng A: Quản trị Trang</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tạo cây trang con, nhân bản từ trang mẫu và bố trí các khối hiển thị giao diện.
          </p>
        </Link>

        <Link
          href="/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban"
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#0072BC] dark:hover:border-sky-500 bg-white dark:bg-slate-900 transition shadow-sm hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold mb-4 group-hover:scale-110 transition">
            B
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Luồng B: Tin bài & Văn bản</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Soạn thảo nội dung và gán hiển thị đồng thời lên nhiều chuyên mục song song.
          </p>
        </Link>

        <Link
          href="/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong"
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#0072BC] dark:hover:border-sky-500 bg-white dark:bg-slate-900 transition shadow-sm hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 font-bold mb-4 group-hover:scale-110 transition">
            C
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Luồng C: Menu Điều hướng</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cấu hình Menu Đầu trang & Chân trang, phân chia cột nhóm và gán liên kết mở trang.
          </p>
        </Link>
      </div>
    </main>
  );
}
