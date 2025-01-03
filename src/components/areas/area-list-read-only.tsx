"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { capitalize } from "@oursrc/components/utils";
import { useToast } from "@oursrc/hooks/use-toast";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";
import { Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";

const columns = [
  { name: "MÃ KHU VỰC", uid: "code", sortable: true },
  { name: "MÔ TẢ", uid: "description", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["code", "description"];

export default function AreaListReadOnly({ setSelected }: any) {
  const { toast } = useToast();

  //Table field
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  //   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastUpdatedAt",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const [areaList, setAreaList] = React.useState<Area[]>([]);

  const [loading, setLoading] = React.useState(false);

  //Use Effect
  React.useEffect(() => {
    setSelected(areaList.filter((x) => Array.from(selectedKeys).includes(x.id as string)));
  }, [selectedKeys]);

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  //API function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await areaService.getAll(page, rowsPerPage);
      if (response.isSuccess) {
        setAreaList(response.data.data || []);
        setRowsPerPage(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: e instanceof AggregateError ? e.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = React.useMemo(() => {
    let cloneFilteredItems: Area[] = [...areaList];

    if (hasSearchFilter) {
      cloneFilteredItems = cloneFilteredItems.filter((item) => item.code.toLowerCase().includes(filterValue.toLowerCase()));
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   cloneFilteredItems = cloneFilteredItems.filter((item) => Array.from(statusFilter).includes(item.code as string));
    // }
    return cloneFilteredItems;
  }, [areaList, filterValue]);

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Area, b: Area) => {
      const first = a[sortDescriptor.column as keyof Area] as string;
      const second = b[sortDescriptor.column as keyof Area] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  //call api
  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  //call api
  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Tìm kiếm theo mã..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
                  Hiển thị cột
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Button color="primary" endContent={<Plus />} onPress={onOpen}>
              Tạo mới
            </Button> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Tổng cộng {totalRecords} kết quả</span>
          <label className="flex items-center text-default-400 text-small">
            Số hàng mỗi trang:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, areaList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: Area, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Area] as string;

    switch (columnKey) {
      case "description":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" delay={1000}>
            <p className="truncate cursor-default">{cellValue}</p>
          </Tooltip>
        );
      // case "actions":
      //   return (
      //     <div className="flex justify-end items-center gap-2">
      //       <Tooltip content="Chi tiết">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <EyeIcon />
      //         </span>
      //       </Tooltip>
      //       <Tooltip content="Chỉnh sửa">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <EditIcon onClick={() => onEdit(data)} />
      //         </span>
      //       </Tooltip>
      //       <Tooltip color="danger" content="Xóa">
      //         <span className="text-lg text-danger cursor-pointer active:opacity-50">
      //           <Trash2Icon onClick={() => onDelete(data)} />
      //         </span>
      //       </Tooltip>
      //     </div>
      //   );
      default:
        return cellValue;
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [selectedKeys, items.length, page, totalPages, hasSearchFilter]);

  return (
    <div>
      <Table
        isHeaderSticky
        color="primary"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[550px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
              {column.name.toUpperCase()}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
          {(item) => (
            <TableRow key={item.id} className="h-12">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
