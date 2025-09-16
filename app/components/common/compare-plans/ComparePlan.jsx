"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export const CompareTable = ({
  onBack,
  selectedPlan: initialSelectedPlan = "pro",
}) => {
  const { t } = useTranslation();

  const Check = "https://cdn.memorae.ai/l4/check_circle.svg";
  const CheckWhite = "https://cdn.memorae.ai/l4/checkcirclewhite.svg";
  const Close = "https://fonts.gstatic.com/s/i/materialicons/close/v1/24px.svg"; // Cross icon for close button

  // Get features from translation
  const features = t("comparePlans.features", []) || [];

  const DashIcon = ({ className = "text-gray-500" }) => (
    <span className={`block mx-auto text-xl ${className}`}>—</span>
  );

  return (
    <div className="relative bg-[#1a1a1a] p-4 rounded-lg text-white w-full max-w-6xl mx-auto">
      {/* Close Button */}
      <button
        className="absolute top-2.5 left-2.5 bg-gray-700 border border-gray-600 rounded p-2 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-600 z-10"
        onClick={onBack || (() => window.history.back())}
        aria-label="Close comparison table"
      >
        <Image
          src={Close}
          alt="Close"
          width={24}
          height={24}
          className="invert"
        />
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[#2a2a2a] rounded-lg min-w-[600px]">
          <thead>
            <tr>
              <th className="p-4 text-center font-bold text-white bg-[#333] border-b border-[#444]">
                {t("comparePlans.functionality")}
              </th>
              <th className="p-4 text-left font-bold text-white bg-[#333] border-b border-[#444]">
                {t("comparePlans.pro")}
              </th>
              <th className="p-4 text-left font-bold text-white bg-[#332833] border-b border-[#444]">
                {t("comparePlans.supernova")}
              </th>
              <th className="p-4 text-left font-bold text-white bg-[#333] border-b border-[#444]">
                {t("comparePlans.supernovaLifetime")}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="hover:bg-[#3a3a3a]">
                <td className="p-4 text-gray-300 border-b border-[#444]">
                  {feature.name}
                </td>
                <td className="p-4 text-center border-b border-[#444]">
                  {feature.pro ? (
                    <Image
                      src={Check}
                      width={20}
                      height={20}
                      alt="Feature available in Pro"
                      className="block mx-auto"
                    />
                  ) : (
                    <DashIcon />
                  )}
                </td>
                <td className="p-4 text-center border-b border-[#444] bg-[#332833]">
                  {feature.supernova ? (
                    <Image
                      src={CheckWhite}
                      width={20}
                      height={20}
                      alt="Feature available in Supernova"
                      className="block mx-auto brightness-[1.2]"
                    />
                  ) : (
                    <DashIcon className="text-[#a78bfa]" />
                  )}
                </td>
                <td className="p-4 text-center border-b border-[#444]">
                  {feature.supernovaLifetime ? (
                    <Image
                      src={CheckWhite}
                      width={20}
                      height={20}
                      alt="Feature available in Supernova Lifetime"
                      className="block mx-auto"
                    />
                  ) : (
                    <DashIcon />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
