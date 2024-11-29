"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  SortDescriptor,
  Selection,
  Pagination,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { VaccinationData } from "../../../../../lib/models/vaccination";
import {
  ResponseObject,
  ResponseObjectList,
} from "@oursrc/lib/models/response-object";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang thực hiện", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const VaccinationList = ({
  selectedVaccination,
  setSelectedVaccination,
}: {
  selectedVaccination: Set<string>;
  setSelectedVaccination: any;
}) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [vaccinationList, setVaccinationList] = React.useState<
    VaccinationData[]
  >([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>(
    new Set([])
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const hasSearchFilter = filterValue.length > 0;

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: VaccinationData[] = [...vaccinationList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) =>
        vaccination.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== 0) {
    //   filteredVaccination = filteredVaccination.filter((vaccination) => Array.from(statusFilter).includes(vaccination.status as number));
    // }

    return filteredVaccination;
  }, [vaccinationList, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems, page, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: VaccinationData, b: VaccinationData) => {
      const first = a[
        sortDescriptor.column as keyof VaccinationData
      ] as unknown as number;
      const second = b[
        sortDescriptor.column as keyof VaccinationData
      ] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getAllVaccinationPlan = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<VaccinationData> =
        await vaccinationService.getMyVaccinationPlan(1, 500);
      console.log("res: ", res);
      if (res && res.isSuccess) {
        setVaccinationList(res.data.data || []);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(selectedKeys);

  React.useEffect(() => {
    getAllVaccinationPlan();
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Tổng số ${totalRecords} kết quả`}
        </span>
        <Pagination 
          isCompact 
          showControls 
          showShadow 
          color="primary" 
          page={page} 
          total={totalPages} 
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2" />
      </div>
    );
  }, [page, totalPages, totalRecords]);

  return (
    <Table
      color="primary"
      classNames={{
        wrapper: "max-h-[250px] overflow-auto",
      }}
      selectionMode="single"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      //   align="center"
      selectedKeys={selectedVaccination}
      onSelectionChange={setSelectedVaccination}
      aria-label="Example static collection table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader>
        <TableColumn allowsSorting className="text-lg">
          Tên lịch
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Ngày bắt đầu
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Ngày kết thúc (dự kiến)
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Tình trạng
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"Không có kết quả"}
        loadingState={isLoading ? "loading" : "idle"}
        loadingContent={<Spinner />}
        items={sortedItems}
      >
        {vaccinationList.map((data: VaccinationData) => (
          <TableRow key={data.id}>
            <TableCell>{data.title}</TableCell>
            <TableCell>{dateTimeConverter(data.startDate)}</TableCell>
            <TableCell>{dateTimeConverter(data.expectedEndDate)}</TableCell>
            <TableCell>
              <p
                className={`${
                  statusColorMap.find(
                    (status) => status.status === String(data.status)
                  )?.color
                } text-center`}
              >
                {data.status}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VaccinationList;
