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

const SummaryCard = ({ title, value, status, isActive, onClick }: SummaryCardProps) => {
  return (
    <div
      onClick={() => onClick(status)}
      className={`
        relative cursor-pointer rounded-2xl sm:rounded-3xl p-2 m-1 sm:p-4 md:p-5
        shadow-md border transition-all duration-300
        ${isActive ? "border-purple-600 scale-95" : "hover:scale-98"}
      `}
    >
      <p className={`text-lg sm:text-xl md:text-2xl font-bold ${valueColors[status]}`}>
        {value}
      </p>
      <p className="text-xs sm:text-sm">{title}</p>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-75">
        {(() => {
          const Icon = statusIcons[status];
          return <Icon className="w-7 h-7" />;
        })()}
      </span>
    </div>
  );
};

export default SummaryCard;