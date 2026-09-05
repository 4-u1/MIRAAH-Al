import React, { useState, useRef, useEffect, useMemo } from "react";
import { AssetRecord } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import {
  Building2,
  Search,
  X,
  ChevronDown,
  MapPin,
  Check,
  Layers,
  Filter,
} from "lucide-react";

interface AssetSearchDropdownProps {
  assets: AssetRecord[];
  selectedAssetId: string;
  onSelectAsset: (assetId: string) => void;
  isArabic?: boolean;
}

export const AssetSearchDropdown: React.FC<AssetSearchDropdownProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const activeAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Extract unique asset types for quick filter pills
  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    assets.forEach((a) => {
      if (a.type) typesSet.add(a.type);
    });
    return Array.from(typesSet);
  }, [assets]);

  // Normalize string for fuzzy/bilingual matching (strip Arabic diacritics/variations)
  const normalize = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .trim()
      .replace(/[أإآ]/g, "ا")
      .replace(/[ة]/g, "ه")
      .replace(/[ى]/g, "ي");
  };

  // Filter assets based on search query (name, location, ID, district, city, type)
  const filteredAssets = useMemo(() => {
    const q = normalize(searchQuery);

    return assets.filter((asset) => {
      // Type filter match
      if (selectedTypeFilter !== "ALL" && asset.type !== selectedTypeFilter) {
        return false;
      }

      if (!q) return true;

      const matchId = normalize(asset.id).includes(q) || `#${normalize(asset.id)}`.includes(q);
      const matchName =
        normalize(asset.name).includes(q) || normalize(asset.nameArabic || "").includes(q);
      const matchLocation =
        normalize(asset.location || "").includes(q) ||
        normalize(asset.locationArabic || "").includes(q) ||
        normalize(asset.city || "").includes(q) ||
        normalize(asset.district || "").includes(q);
      const matchType =
        normalize(asset.type || "").includes(q) || normalize(asset.typeArabic || "").includes(q);

      return matchId || matchName || matchLocation || matchType;
    });
  }, [assets, searchQuery, selectedTypeFilter]);

  // Keep highlighted index within bounds
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredAssets.length, searchQuery, selectedTypeFilter]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setSelectedTypeFilter("ALL");
    }
  }, [isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredAssets.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredAssets.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredAssets[highlightedIndex]) {
        onSelectAsset(filteredAssets[highlightedIndex].id);
        setIsOpen(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "";
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    return amount.toLocaleString();
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onKeyDown={handleKeyDown}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={isArabic ? "اختيار وتصفية الأصول العقارية" : "Select and filter real estate assets"}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all select-none cursor-pointer shadow-inner ${
          isOpen
            ? isDark
              ? "bg-slate-900 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 ring-1 ring-cyan-500/30"
              : "bg-cyan-50 border-cyan-500 text-cyan-800 ring-1 ring-cyan-400"
            : isDark
            ? "bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-white"
            : "bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-500/50 text-slate-800 hover:text-slate-950 shadow-sm"
        }`}
      >
        <div className={`p-1 rounded-lg border ${
          isDark
            ? "bg-slate-950 border-slate-800/80 text-cyan-400 group-hover:text-cyan-300"
            : "bg-cyan-100/60 border-cyan-200 text-cyan-700"
        }`}>
          <Building2 className="w-3.5 h-3.5" />
        </div>

        {/* Selected Asset Label */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-left">
          <span className={`px-1.5 py-0.2 text-[10px] rounded border ${
            isDark
              ? "bg-cyan-950/80 text-cyan-400 border-cyan-500/30"
              : "bg-cyan-100 text-cyan-800 border-cyan-300"
          }`}>
            #{activeAsset?.id}
          </span>
          <span className={`max-w-[110px] sm:max-w-[160px] md:max-w-[200px] truncate transition-colors ${
            isDark
              ? "text-slate-100 group-hover:text-cyan-300"
              : "text-slate-800 group-hover:text-cyan-700"
          }`}>
            {activeAsset
              ? isArabic
                ? activeAsset.nameArabic || activeAsset.name
                : activeAsset.name
              : isArabic
              ? "اختر أصلاً"
              : "Select Asset"}
          </span>
        </div>

        {/* Total Assets Pill & Chevron */}
        <div className={`flex items-center gap-1 shrink-0 ${isDark ? "text-slate-400 group-hover:text-slate-200" : "text-slate-500 group-hover:text-slate-800"}`}>
          <span className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
            isDark
              ? "bg-slate-950 text-slate-400 border-slate-800"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}>
            {assets.length}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-cyan-500" : isDark ? "text-slate-400 group-hover:text-cyan-400" : "text-slate-500 group-hover:text-cyan-600"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-[320px] sm:w-[380px] md:w-[420px] rounded-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#090e1c] border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.18)]"
              : "bg-white border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/5"
          } ${
            isArabic ? "left-0 sm:right-auto" : "right-0 sm:left-auto"
          }`}
        >
          {/* Top Search Input Bar */}
          <div className={`p-3 border-b space-y-2 ${isDark ? "border-slate-800/80 bg-slate-950/90" : "border-slate-100 bg-slate-50/80"}`}>
            <div className="relative flex items-center">
              <Search className={`absolute w-4 h-4 pointer-events-none ${isDark ? "text-cyan-400" : "text-cyan-600"} ${isArabic ? "right-3" : "left-3"}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث بالاسم، الموقع، الحي، أو المعرف (ID)..."
                    : "Search by name, location, district, or ID..."
                }
                className={`w-full py-2 border rounded-xl text-xs font-mono outline-none transition-all ${
                  isDark
                    ? "bg-slate-900/90 border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-500"
                    : "bg-white border-slate-200 focus:border-cyan-500 text-slate-900 placeholder:text-slate-400"
                } ${
                  isArabic ? "pr-9 pl-8 text-right" : "pl-9 pr-8 text-left"
                }`}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className={`absolute p-1 rounded-md cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                  } ${
                    isArabic ? "left-2" : "right-2"
                  }`}
                  title={isArabic ? "مسح البحث" : "Clear search"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Type Filter Chips & Match Count */}
            <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`p-1 ${isDark ? "text-slate-500" : "text-slate-400"}`} title={isArabic ? "تصفية حسب النوع" : "Filter by type"}>
                  <Filter className="w-3 h-3 text-cyan-500" />
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter("ALL")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedTypeFilter === "ALL"
                      ? isDark
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "bg-cyan-100 text-cyan-800 border border-cyan-300 font-extrabold"
                      : isDark
                      ? "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {isArabic ? "الكل" : "All"} ({assets.length})
                </button>

                {availableTypes.map((type) => {
                  const isSelected = selectedTypeFilter === type;
                  const typeLabel =
                    type === "Commercial Tower"
                      ? isArabic ? "تجاري" : "Commercial"
                      : type === "Residential Villa"
                      ? isArabic ? "فيلا سكنية" : "Villa"
                      : type === "Logistics Warehouse"
                      ? isArabic ? "لوجستي" : "Logistics"
                      : type === "Residential Compound"
                      ? isArabic ? "مجمع سكني" : "Compound"
                      : type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedTypeFilter(type)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                            : "bg-cyan-100 text-cyan-800 border border-cyan-300 font-extrabold"
                          : isDark
                          ? "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      {typeLabel}
                    </button>
                  );
                })}
              </div>

              <span className={`text-[10px] font-mono shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {filteredAssets.length}{" "}
                {isArabic ? "أصل" : filteredAssets.length === 1 ? "asset" : "assets"}
              </span>
            </div>
          </div>

          {/* Scrollable Assets List */}
          <div
            ref={listRef}
            className={`max-h-[340px] overflow-y-auto p-2 space-y-1.5 divide-y ${
              isDark ? "divide-slate-800/30" : "divide-slate-100"
            }`}
            role="listbox"
          >
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => {
                const isSelected = asset.id === selectedAssetId;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={asset.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectAsset(asset.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-cyan-50 border-cyan-400 text-cyan-900 shadow-sm"
                        : isHighlighted
                        ? isDark
                          ? "bg-slate-800/80 border-slate-700/80 text-white"
                          : "bg-slate-100/90 border-slate-300 text-slate-900"
                        : isDark
                        ? "bg-slate-900/40 hover:bg-slate-850 border-slate-800/60 text-slate-300"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Left Title & Location Info */}
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? isDark
                                ? "bg-cyan-500/30 border border-cyan-400/50 text-cyan-300"
                                : "bg-cyan-100 border border-cyan-300 text-cyan-800"
                              : isDark
                              ? "bg-slate-950 border border-slate-800 text-slate-400"
                              : "bg-slate-100 border border-slate-200 text-slate-600"
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              isDark
                                ? "bg-slate-950 border-slate-800 text-cyan-400"
                                : "bg-cyan-50 border-cyan-200 text-cyan-800"
                            }`}>
                              #{asset.id}
                            </span>
                            <h4
                              className={`text-xs font-bold truncate leading-tight ${
                                isSelected
                                  ? isDark ? "text-cyan-100" : "text-cyan-950"
                                  : isDark ? "text-slate-100" : "text-slate-900"
                              }`}
                            >
                              {isArabic
                                ? asset.nameArabic || asset.name
                                : asset.name}
                            </h4>
                          </div>

                          {/* Location with Pin Icon */}
                          <div className={`flex items-center gap-1 text-[11px] mt-1 truncate ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}>
                            <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
                            <span className="truncate">
                              {isArabic
                                ? asset.district
                                  ? `${asset.district}، ${asset.city}`
                                  : asset.locationArabic || asset.location
                                : asset.district
                                ? `${asset.district}, ${asset.city}`
                                : asset.location}
                            </span>
                          </div>

                          {/* Key Specs Tags (Size + Valuation + Type) */}
                          <div className={`flex items-center gap-2 mt-1.5 text-[10px] font-mono flex-wrap ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}>
                            {asset.sizeSqm && (
                              <span className={`px-1.5 py-0.2 rounded border ${
                                isDark ? "bg-slate-950 border-slate-800/80" : "bg-slate-50 border-slate-200"
                              }`}>
                                {asset.sizeSqm.toLocaleString()}{" "}
                                {isArabic ? "م²" : "m²"}
                              </span>
                            )}
                            {asset.valuationSar && (
                              <span className={`px-1.5 py-0.2 rounded border font-bold ${
                                isDark
                                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
                              }`}>
                                {formatCurrency(asset.valuationSar)}{" "}
                                {isArabic ? "ر.س" : "SAR"}
                              </span>
                            )}
                            <span className={`px-1.5 py-0.2 rounded border ${
                              isDark ? "bg-slate-950/80 border-slate-800/80 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}>
                              {isArabic
                                ? asset.typeArabic || asset.type
                                : asset.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Indicator (Checkmark if selected) */}
                      {isSelected && (
                        <div className={`shrink-0 p-1 rounded-full border ${
                          isDark
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                            : "bg-cyan-100 text-cyan-700 border-cyan-300"
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Search Results State */
              <div className="py-8 px-4 text-center space-y-3">
                <div className={`w-10 h-10 mx-auto rounded-2xl border flex items-center justify-center ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"
                }`}>
                  <Search className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </div>
                <div>
                  <p className={`text-xs font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                    {isArabic
                      ? `لم يتم العثور على أصول تطابق "${searchQuery}"`
                      : `No assets found matching "${searchQuery}"`}
                  </p>
                  <p className={`text-[11px] mt-1 max-w-[260px] mx-auto ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    {isArabic
                      ? "جرّب البحث باسم الحي (الملقا، الأندلس، العليا) أو رقم المعرف (20481) أو نوع العقار."
                      : "Try searching by district (Al-Malqa, Al-Andalus, Olaya), asset ID (20481), or property type."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTypeFilter("ALL");
                    searchInputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-600 dark:text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  {isArabic ? "مسح البحث وإظهار الكل" : "Clear & Show All"}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Footer Info Bar */}
          <div className={`px-3 py-2 border-t flex items-center justify-between text-[10px] font-mono ${
            isDark ? "border-slate-800/80 bg-slate-950 text-slate-500" : "border-slate-100 bg-slate-50 text-slate-500"
          }`}>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-500" />
              <span>
                {isArabic ? "محفظة الأصول:" : "Portfolio:"} {assets.length}{" "}
                {isArabic ? "أصول مجهزة" : "assets"}
              </span>
            </span>
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>
              {isArabic ? "اضغط Esc للإغلاق" : "Esc to close"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
