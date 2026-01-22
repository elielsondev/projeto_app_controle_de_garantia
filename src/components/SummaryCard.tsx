import { type ResumoItem } from "../data";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface SummaryCardProps extends ResumoItem {
  isActive: boolean;
  onClick: (status: ResumoItem["status"]) => void;
}

const statusIcons: Record<ResumoItem["status"], LucideIcon> = {
  total: FileText,
  expiring: Clock,
  active: CheckCircle,
  expired: XCircle,
};

const valueColors: Record<ResumoItem["status"], string> = {
  total: "text-black-600",
  expiring: "text-yellow-600",
  active: "text-green-600",
  expired: "text-red-600",
};

const iconColors: Record<ResumoItem["status"], string> = {
  total: "#724EBF",
  expiring: "#FFBE07",
  active: "#478E2C",
  expired: "#D41414",
};

const SummaryCard = ({ title, value, status, isActive, onClick }: SummaryCardProps) => {
  const Icon = statusIcons[status];
  const iconColor = iconColors[status];

  return (
    <div
      onClick={() => onClick(status)}
      className={`
        relative cursor-pointer rounded-2xl sm:rounded-3xl p-6 m-1 sm:p-5 md:p-6
        shadow-md border transition-all duration-300
        ${isActive ? "border-purple-600 scale-95" : "hover:scale-98"}
      `}
    >
      <div className="flex flex-col text-left">
        <p className="font-medium text-xs sm:text-sm">{title}</p>
        <p className={`text-lg sm:text-xl md:text-2xl font-bold ${valueColors[status]}`}>
          {value}
        </p>
      </div>

      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        <Icon className="w-7 h-7" style={{ color: iconColor }} />
      </span>
    </div>
  );
};

export default SummaryCard;