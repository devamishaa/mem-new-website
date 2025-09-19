"use client";

import Image from "next/image";
import styles from "@/styles/components/sections/compareTable/CompareTable.module.css";
import { useTranslation } from "@/hooks/useTranslation";

export const CompareTable = ({
  onBack,
  selectedPlan: initialSelectedPlan = "pro",
}) => {
  const { t } = useTranslation();
  const Check = "https://cdn.memorae.ai/l4/check_circle.svg";
  const CheckWhite = "https://cdn.memorae.ai/l4/checkcirclewhite.svg";
  const Close = "https://fonts.gstatic.com/s/i/materialicons/close/v1/24px.svg"; // Cross icon for close button
  const featureNames = t("comparePlan.table.features", []);
  const features = (Array.isArray(featureNames) ? featureNames : []).map(
    (name) => ({
      name: [name],
      pro: true,
      supernova: true,
      supernovaLifetime: true,
    })
  );

  const DashIcon = () => <span>—</span>;

  return (
    <div
      className={styles.compareTableContainer}
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      {/* Close Button */}
      <button
        className={styles.closeBtn}
        onClick={onBack || (() => window.history.back())}
        aria-label="Close comparison table"
      >
        <Image src={Close} alt="Close" width={20} height={20} />
      </button>

      <div className={styles.tableScrollWrapper}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>
                {t("comparePlan.table.headerFeature", "Feature")}
              </th>
              <th>{t("comparePlan.table.headerPro", "Pro")}</th>
              <th className={styles.supernovaHeader}>
                {t("comparePlan.table.headerSupernova", "Supernova")}
              </th>
              <th>
                {t(
                  "comparePlan.table.headerSupernovaLifetime",
                  "Supernova Lifetime"
                )}
              </th>
            </tr>
          </thead>
          <tbody className="tbody">
            {features.map((feature, index) => (
              <tr key={index}>
                <td>{feature.name.join(" ")}</td>
                <td>
                  {feature.pro ? (
                    <Image
                      src={Check}
                      width={20}
                      height={20}
                      alt="Feature available in Pro"
                    />
                  ) : (
                    <DashIcon />
                  )}
                </td>
                <td className={styles.supernovaHighlight}>
                  {feature.supernova ? (
                    <Image
                      src={CheckWhite}
                      width={20}
                      height={20}
                      alt="Feature available in Supernova"
                    />
                  ) : (
                    <DashIcon />
                  )}
                </td>
                <td>
                  {feature.supernovaLifetime ? (
                    <Image
                      src={CheckWhite}
                      width={20}
                      height={20}
                      alt="Feature available in Supernova Lifetime"
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
