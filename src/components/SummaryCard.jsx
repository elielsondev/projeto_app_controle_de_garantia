const SummaryCard = ({ title, value, icon, status }) => {
  const colors = {
    total: "bg-[#37a0eb]",
    vencendo: "bg-[#e9df52]",
    ativas: "bg-[#4ddf59]",
    vencidas: "bg-[#ee5168]",
  };

  return (
    <div className={`relative rounded-xl p-4 shadow-sm ${colors[status]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{title}</p>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl opacity-75">
        {icon}
      </span>
    </div>
  );
};

export default SummaryCard;
