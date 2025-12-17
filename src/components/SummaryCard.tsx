import { type ResumoItem } from "../data";
import activeIcon from "../assets/activeIcon.png";
import attentionIcon from "../assets/attentionIcon.png";
import documentIcon from "../assets/documentIcon.png";
import expiringIcon from "../assets/expiringIcon.png";

interface SummaryCardProps extends ResumoItem {}

const SummaryCard = ({ title, value, status }: SummaryCardProps) => {
  const colors: Record<ResumoItem["status"], string> = {
    total: "bg-[#0000]",
    expiring: "bg-[#0000]",
    active: "bg-[#0000]",
    expired: "bg-[#0000]",
  };

  const valueColors: Record<ResumoItem["status"], string> = {
    total: "text-black",
    expiring: "text-[#FFBE07]",
    active: "text-[#478E2C]",
    expired: "text-[#D41414]",
  };

  const statusIcons: Record<ResumoItem["status"], string> = {
    total: documentIcon,
    expiring: expiringIcon,
    active: activeIcon,
    expired: attentionIcon,
  };

  return (
    <div className={`relative rounded-2xl sm:rounded-3xl p-2 m-1 sm:p-4 md:p-5 shadow-md border transition-transform duration-300 md:hover:scale-98 md:hover:shadow-xl ${colors[status]}`}>
      <p className={`text-lg sm:text-xl md:text-2xl font-bold ${valueColors[status]}`}>{value}</p>
      <p className="text-xs sm:text-sm">{title}</p>
      <span className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-75">
        <img src={statusIcons[status]} alt={title} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
      </span>
    </div>
  );
};

export default SummaryCard;
