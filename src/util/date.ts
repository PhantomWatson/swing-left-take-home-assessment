export const sortByDate = (rowA, rowB, columnId) => {
  const dateA = new Date(rowA.getValue(columnId));
  const dateB = new Date(rowB.getValue(columnId));
  return dateA.getTime() - dateB.getTime();
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "Unknown date";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
