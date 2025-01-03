const columns = [
  { name: "MÃ CHUỒNG", uid: "code", sortable: true },
  {
    name: "SỨC CHỨA",
    uid: "capacity",
    sortable: true,
  },
  { name: "SỐ LƯỢNG", uid: "availableQuantity", sortable: true },
  { name: "MÃ KHU", uid: "areaCode", sortable: true },
  // { name: "MÔ TẢ", uid: "description", sortable: true },
  // { name: "LẦN CUỐI CẬP NHẬT", uid: "lastUpdatedAt", sortable: true },
  // { name: "CẬP NHẬT BỞI", uid: "lastUpdatedBy", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["code", "capacity", "areaCode", "availableQuantity"];

const statusOptions = [{ name: "", active: "" }];

//mock
const cages = [
  {
    id: "1",
    unit: "ABC",
    name: "Ten thuoc A",
    mainIngredient: "Chất gây ung thưacnsacnosans",
    quantity: 10,
    netWeight: 123,
    usage: "123123",
    lastUpdatedAt: "2024-09-09",
    lastUpdatedBy: "tui",
  },
];

export { columns, cages, statusOptions, INITIAL_VISIBLE_COLUMNS };
