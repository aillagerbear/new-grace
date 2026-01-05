import React from 'react';

const NewsGrid = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Latest News Section */}
      <section className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="flex items-center border-b border-[#E2E8F0]">
          <div className="px-4 py-3.5">
            <h3 className="text-[15px] font-bold text-[#1A202C]">최신 소식</h3>
          </div>
        </div>
        <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
          내용을 추가하세요
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="flex items-center border-b border-[#E2E8F0]">
          <div className="px-4 py-3.5">
            <h3 className="text-[15px] font-bold text-[#1A202C]">인기글</h3>
          </div>
        </div>
        <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
          내용을 추가하세요
        </div>
      </section>

      {/* Section 3 */}
      <section className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="flex items-center border-b border-[#E2E8F0]">
          <div className="px-4 py-3.5">
            <h3 className="text-[15px] font-bold text-[#1A202C]">섹션 3</h3>
          </div>
        </div>
        <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
          내용을 추가하세요
        </div>
      </section>

      {/* Section 4 */}
      <section className="bg-white rounded-[10px] border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="flex items-center border-b border-[#E2E8F0]">
          <div className="px-4 py-3.5">
            <h3 className="text-[15px] font-bold text-[#1A202C]">섹션 4</h3>
          </div>
        </div>
        <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
          내용을 추가하세요
        </div>
      </section>
    </div>
  );
};

export default NewsGrid;
