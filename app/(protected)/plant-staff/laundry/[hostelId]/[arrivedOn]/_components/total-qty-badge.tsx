export const TotalQtyBadge = ({
  weight,
  title,
  type,
}: {
  weight: number;
  title: string;
  type: "weight" | "item";
}) => {
  return (
    <div className="flex items-center ring-1 ring-primary rounded-lg p-2 gap-x-4 justify-between sm:w-[50%] xl:w-fit xl:justify-start hover:-translate-y-2 transition duration-200 shadow-lg cursor-pointer">
      <div className="font-semibold text-sm">{title}</div>
      <div className="font-bold">
        {weight} {type === "weight" && "KG"}
      </div>
    </div>
  );
};
