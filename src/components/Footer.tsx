import React from 'react';
import { Newspaper, Sparkles, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 mt-20 pt-14 pb-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-850 text-sm">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-stone-950 flex items-center justify-center font-serif-luxury font-bold text-lg shadow-md">
                شام
              </div>
              <span className="text-xl font-extrabold text-white font-serif-luxury tracking-wide">
                صمم عطرك مع شام
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              المنصة المتكاملة لصناع ومصممي العطور والمعامل ومتاجر الزيوت؛ تضم حاسبة التراكيز، أشهر الأكوردات العالمية، موسوعة المواد الخام الكيميائية والطبيعية، ومرصد أخبار العطور العالمية.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>مجهزة بخبير المعمل الذكي (الخبير شاهين AI)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>الأخبار والمكتبات العالمية</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 text-amber-200 font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>الرئيسية (بوابة منافذ وأقسام المعمل الـ 12)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('perfume_news')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>آخر أخبار العطور في العالم (ميلانو، دبي، غراس)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('world_perfumes')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>أشهر العطور العالمية (بكرات روج، أفينتوس، توم فورد)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('raw_materials')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>موسوعة المواد الخام، المذيبات، والأمبروكسان</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('master_ai')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>مجلس الخبير شاهين · استشارة الذكاء الاصطناعي</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold text-white text-xs tracking-wider uppercase">
              الحاسبات والمعايير المعملية
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('concentration')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  حاسبة نسب التركيز وتعبئة الزجاجات (Extrait, EDP, EDT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pyramid')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  حاسبة الهرم العطري وتوافق النوتات
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('alcohol')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  حاسبة تخفيف تركيز الكحول (قانون التخفيف C₁V₁)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('costing')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  حاسبة التكاليف الصناعية وهوامش الأرباح
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  دليل التعتيق وجداول المثبتات الكيميائية
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} صمم عطرك مع شام (Sham Perfume Suite).
          </div>
          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <span>دقة ميزان المعمل (0.01g)</span>
            <span aria-hidden="true">·</span>
            <span>معايير IFRA 51 الدولية</span>
            <span aria-hidden="true">·</span>
            <span>موسوعة الخامات العالمية</span>
            <span aria-hidden="true">·</span>
            <span>مرصد أخبار العطور</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
