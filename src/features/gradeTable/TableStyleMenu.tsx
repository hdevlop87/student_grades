'use client';

import { useTableStyleStore } from '@/stores/use-table-style-store';

interface TableStyleMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function TableStyleMenu({ x, y, onClose }: TableStyleMenuProps) {
  const paddingY = useTableStyleStore((state) => state.paddingY);
  const fontSize = useTableStyleStore((state) => state.fontSize);
  const pagePaddingTop = useTableStyleStore((state) => state.pagePaddingTop);
  const pagePaddingX = useTableStyleStore((state) => state.pagePaddingX);
  const setPaddingY = useTableStyleStore((state) => state.setPaddingY);
  const setFontSize = useTableStyleStore((state) => state.setFontSize);
  const setPagePaddingTop = useTableStyleStore((state) => state.setPagePaddingTop);
  const setPagePaddingX = useTableStyleStore((state) => state.setPagePaddingX);
  const resetStyles = useTableStyleStore((state) => state.resetStyles);

  return (
    <>
      <div
        className="fixed inset-1 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 max-h-[80vh] overflow-y-auto"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">تنسيق الجدول</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المسافة العمودية (Y): {paddingY}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={paddingY}
              onChange={(e) => setPaddingY(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حجم النص: {fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="border-t pt-3 mt-3 border-secondary">

            <h4 className="text-sm font-semibold text-gray-700 mb-3">هوامش الصفحة</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأعلى: {pagePaddingTop}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pagePaddingTop}
                  onChange={(e) => setPagePaddingTop(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  يمين/يسار: {pagePaddingX}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pagePaddingX}
                  onChange={(e) => setPagePaddingX(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={resetStyles}
              className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
            >
              إعادة تعيين
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </>
  );
}