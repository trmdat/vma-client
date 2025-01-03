const columns = [
  { name: "Giống", uid: "breed", sortable: true },
  { name: "Đàn", uid: "herdId", sortable: true },
  { name: "Chuồng", uid: "cageId", sortable: true },
  { name: "Cân nặng (kg)", uid: "weight", sortable: true },
  { name: "Chiều cao (cm)", uid: "height", sortable: true },
  { name: "Chiều rộng (cm)", uid: "width", sortable: true },
  { name: "Sức khỏe", uid: "healthStatus", sortable: true },
  { name: "Tình trạng", uid: "status", sortable: true },
  { name: "Cập nhật lần cuối", uid: "lastUpdatedAt", sortable: true },
  { name: "Mã heo", uid: "pigCode", sortable: true },
  { name: "Mã chuồng", uid: "cageCode", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const statusOptions = [
  { name: "Khỏe mạnh", uid: "normal" },
  { name: "Bệnh", uid: "sick" },
  { name: "Chết", uid: "dead" },
];

const pigs = [
  {
    id: 1,
    breed: "Iberico",
    cage: "1",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    breed: "Iberico",
    cage: "2",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-09",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    breed: "Iberico",
    cage: "3",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-08",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: 4,
    breed: "Iberico",
    cage: "4",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-07",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
  {
    id: 5,
    breed: "Iberico",
    cage: "5",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-06",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
  },
  {
    id: 6,
    breed: "Iberico",
    cage: "6",
    herd: "1",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-05",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 7,
    breed: "Iberico",
    cage: "1",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "sick",
    nextVaccinationDate: "2021-09-04",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
  },
  {
    id: 8,
    breed: "Iberico",
    cage: "2",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "dead",
    nextVaccinationDate: "2021-09-03",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
  },
  {
    id: 9,
    breed: "Iberico",
    cage: "3",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-02",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 10,
    breed: "Iberico",
    cage: "4",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-08-30",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 11,
    breed: "Iberico",
    cage: "5",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-08-10",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 12,
    breed: "Iberico",
    cage: "6",
    herd: "2",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-07-10",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 13,
    breed: "Iberico",
    cage: "1",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 14,
    breed: "Iberico",
    cage: "2",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
  {
    id: 15,
    breed: "Iberico",
    cage: "3",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 16,
    breed: "Iberico",
    cage: "4",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 17,
    breed: "Iberico",
    cage: "5",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 18,
    breed: "Iberico",
    cage: "6",
    herd: "3",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=29",
  },
  {
    id: 19,
    breed: "Iberico",
    cage: "1",
    herd: "4",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=50",
  },
  {
    id: 20,
    breed: "Iberico",
    cage: "2",
    herd: "4",
    weight: "100kg",
    height: "1m",
    width: "1m",
    status: "active",
    nextVaccinationDate: "2021-09-10",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  // {
  //   id: 20,
  //   name: "Mia Robinson",
  //   role: "Coordinator",
  //   team: "Operations",
  //   status: "active",
  //   age: "26",
  //   avatar: "https://i.pravatar.cc/150?img=45",
  //   email: "mia.robinson@example.com",
  // },
];

export { columns, pigs, statusOptions };
