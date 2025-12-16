const SummaryCard = ({ title, value, icon, status } : any) => {
  const colors = {
    total: "bg-[#0000]" ,
    vencendo: "bg-[#0000]",
    ativas: "bg-[#0000]",
    vencidas: "bg-[#0000]",
  };

  return (
    <div className={`relative rounded-xl p-5 shadow-sm ${colors[status]}`}>
      <p className="text-2xl font-bold ">{value}</p>
      <p className="text-sm">{title}</p>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl opacity-75">
        {icon}
      </span>
    </div>
  );
};

export default SummaryCard;
