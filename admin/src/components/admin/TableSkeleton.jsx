const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-12 bg-gray-100 rounded-lg"
      />
    ))}
  </div>
);

export default TableSkeleton