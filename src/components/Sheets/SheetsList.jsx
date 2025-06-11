import { SheetCard } from './SheetCard.jsx'

export const SheetsList = ({  sheets, onEdit, onDelete  }) => {
    const validSheets = (sheets || []).filter(Boolean);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {validSheets.map((sheet) => (
        <SheetCard
          key={sheet.id}
          sheet={sheet}
          onEdit={onEdit} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
