const columns = [
  { name: "TÊN", uid: "name", sortable: true },
  {
    name: "THÀNH PHẦN CHÍNH",
    uid: "mainIngredient",
    sortable: true,
  },
  { name: "SỐ LƯỢNG", uid: "quantity", sortable: true },
  { name: "TRỌNG LƯỢNG", uid: "netWeight", sortable: true },
  { name: "CÁCH SỬ DỤNG", uid: "usage", sortable: true },
  { name: "ĐƠN VỊ", uid: "unit", sortable: true },
  { name: "LẦN CUỐI CẬP NHẬT", uid: "lastUpdatedAt", sortable: true },
  { name: "CẬP NHẬT BỞI", uid: "lastUpdatedBy", sortable: true },
  { name: "", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "unit",
  "name",
  "mainIngredient",
  "quantity",
  "netWeight",
  "usage",
];

const statusOptions = [{ name: "", uid: "" }];

export { columns, statusOptions, INITIAL_VISIBLE_COLUMNS };
