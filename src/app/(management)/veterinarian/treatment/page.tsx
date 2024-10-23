"use client";
import React from "react";
import { dateConverter } from "@oursrc/lib/utils";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { useRouter } from "next/navigation";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { Accordion, AccordionItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, Skeleton, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { FaClock, FaRegCalendarPlus } from "react-icons/fa6";
import { TbMedicineSyrup } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { TreatmentData, CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import TreatmentList from "./_components/treatment-list";
import Image from "next/image";
import { MdCalendarToday, MdOutlineStickyNote2 } from "react-icons/md";
import { IoIosCalendar } from "react-icons/io";
import { PiNotebookDuotone } from "react-icons/pi";
import { BiDetail } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";

const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang diễn ra", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const treatmentDetail: TreatmentData = {
  id: "1",
  title: "Lịch 1",
  description: "Mô tả 1",
  herdId: "1",
  startDate: "2022-10-10",
  expectedEndDate: "2022-10-20",
  actualEndDate: "2022-10-20",
  note: "Ghi chú 1",
  status: 0,
  treatmentStages: [],
};

const Treatment = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = React.useState(new Set<string>());
  const [treatmentData, setTreatmentData] = React.useState<TreatmentData | undefined>(treatmentDetail);
  const [herd, setHerd] = React.useState<HerdInfo>();
  const [filterStatus, setFilterStatus] = React.useState("not-done");
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const [selectedVaccination, setSelectedVaccination] = React.useState<CreateTreatmentStageProps>();

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") {
      return "Tất cả";
    } else if (filterStatus === "done") {
      return "Đã tiêm";
    } else {
      return "Chưa tiêm";
    }
  }, [filterStatus]);

  const filterTreatment = (status: string) => {
    const data = treatmentData?.treatmentStages || [];
    console.log(data);
    if (status === "all") {
      return data;
    } else if (status === "done") {
      return data.filter((treatment) => treatment.isDone === true);
    } else {
      return data.filter((treatment) => treatment.isDone === false);
    }
  };

  const getMedicineInStage = async (id: string) => {
    try {
      // const res: any = await vaccinationService.getMedicineInStage(id);
      // if (res.isSuccess) {
      //   setMedicineList(res.data.medicine || []);
      // }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    }
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return ((now - start) / (end - start)) * 100;
  };

  const findTreatmentPlan = async (id: string) => {
    try {
      // setLoading(true);
      // // const vaccinationId = "4b75d78c-7c38-4447-9fe7-ebbcaff55faf";
      // const res: ResponseObject<any> = await vaccinationService.getVaccinationPlan(id);
      // if (res && res.isSuccess) {
      //   setVaccinationData(res.data);
      // } else {
      //   console.log("Error: ", res.errorMessage);
      // }
      // const response: ResponseObject<HerdInfo> = await herdService.getHerdByVaccinationPlanId(id);
      // if (response && response.isSuccess) {
      //   setHerd(response.data);
      // } else {
      //   console.log("Error: ", response.errorMessage);
      // }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
    // return vaccinationData.find(
    //   (vaccination) => vaccination.id === id.values().next().value
    // );
  };

  React.useEffect(() => {
    if (selectedTreatmentId.size > 0) {
      findTreatmentPlan(selectedTreatmentId.values().next().value);
    }
  }, [selectedTreatmentId]);

  React.useEffect(() => {
    if (!selectedVaccination) {
      findTreatmentPlan(selectedTreatmentId.values().next().value);
    }
  }, [selectedVaccination]);

  return (
    <div>
      <Tabs size="lg" color="primary" variant="solid">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <IoIosCalendar size={20} />
              <span className="ml-2">Kế hoạch điều trị</span>
            </div>
          }
        >
          <div>
            <div className="flex mb-5">
              <div className="w-1/2 mr-2 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
                    <p className="text-2xl font-bold ml-4">Chọn kế hoạch</p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="solid"
                      color="primary"
                      onPress={() => {
                        router.push("/veterinarian/treatment/create-plan");
                      }}
                    >
                      Tạo kế hoạch mới
                    </Button>
                  </div>
                </div>
                <TreatmentList setSelectedTreatment={setSelectedTreatmentId} />
              </div>
              <div className="w-1/2 ml-2 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <p className="text-2xl font-bold">Thuốc được sử dụng nhiều nhất</p>
                <div className="mt-5 flex justify-between">
                  <div className="flex items-center">
                    <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold ml-4">Thuốc 1</p>
                      <p className="text-lg ml-4">Được sử dụng trong 10 kế hoạch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="m-2 col-span-1 border-2 rounded-lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-60 rounded-lg bg-default-300"></div>
                    </Skeleton>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full mb-3 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <div className="flex flex-shrink gap-5">
                  <div className="p-3 border-2 rounded-2xl w-1/2">
                    <p className="text-xl font-semibold">Chi tiết kế hoạch điều trị</p>
                    {treatmentData ? (
                      <div>
                        <div className="mby-2 flex items-center">
                          <FaRegCalendarPlus className="my-auto mr-4 text-3xl" />
                          <p className="my-auto text-2xl font-bold mt-3">{treatmentData.title}</p>
                        </div>
                        <p className="text-lg mt-3">{treatmentData.description}</p>
                        <div className="flex justify-between">
                          <p className="text-md mt-3">Đàn:</p>
                          <p className="text-lg mt-3 font-semibold">{treatmentData.herdId}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-md mt-3">Ngày bắt đầu</p>
                          <p className="text-md mt-3">Ngày kết thúc (dự kiến)</p>
                        </div>
                        <Progress value={calculateProgress(treatmentData.startDate, treatmentData.expectedEndDate)} />
                        <div className="flex justify-between">
                          <p className="text-lg mt-3 font-semibold">{dateConverter(treatmentData.startDate)}</p>
                          <p className="text-lg mt-3 font-semibold">{dateConverter(treatmentData.expectedEndDate)}</p>
                        </div>
                        {treatmentData.actualEndDate && (
                          <div className="flex justify-between">
                            <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                            <p className="text-lg mt-3 font-semibold">{treatmentData.actualEndDate}</p>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <p className="text-md mt-3">Ghi chú:</p>
                          <p className="text-lg mt-3 font-semibold">{treatmentData.note ? treatmentData.note : "Không có"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-md mt-3">Tình trạng</p>
                          <p
                            className={`text-lg mt-3 font-semibold ${
                              statusMap.find((status) => status.value === treatmentData.status)?.value === 1
                                ? "text-blue-500"
                                : statusMap.find((status) => status.value === treatmentData.status)?.value === 2
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {statusMap.find((status) => status.value === treatmentData.status)?.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-lg mt-3">Chưa chọn kế hoạch điều trị</p>
                    )}
                  </div>
                  <div className="p-3 border-2 rounded-2xl w-1/2">
                    <Accordion variant="splitted">
                      <AccordionItem key="1" title="Thông tin đàn heo" startContent={<BiDetail className="text-sky-500" size={25} />}>
                        {/* <p className="text-xl font-semibold">Thông tin đàn heo</p> */}
                        {herd ? (
                          <div>
                            <div className="mt-3 flex justify-between">
                              <p className="text-md">Tên đàn:</p>
                              <p className="text-lg font-semibold">{herd.code}</p>
                            </div>
                            <div className="mt-3 flex justify-between">
                              <p className="text-md">Số lượng:</p>
                              <p className="text-lg font-semibold">{herd.totalNumber}</p>
                            </div>
                            <div className="mt-3 flex justify-between">
                              <p className="text-md">Giống:</p>
                              <p className="text-lg font-semibold">{herd.breed}</p>
                            </div>
                            {/* <div className="mt-3 flex justify-between">
                  <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                    <AccordionItem key={1} title="Danh sách chuồng">
                      <div className="flex justify-between">
                        <p className="text-xs font-light">Mã code</p>
                        <p className="text-xs font-light">Tên chuồng</p>
                        <p className="text-xs font-light">Số lượng</p>
                      </div>
                      {herd.barns.map((barn) => (
                        <div key={barn.id} className="flex justify-between">
                          <p className="text-lg mt-2">{barn.code}</p>
                          <p className="text-lg mt-2">{barn.name}</p>
                          <p className="text-lg mt-2">{barn.quantity}</p>
                        </div>
                      ))}
                    </AccordionItem>
                  </Accordion>
                </div> */}
                          </div>
                        ) : (
                          <p className="text-center text-lg mt-3">Chưa chọn kế hoạch điều trị</p>
                        )}
                      </AccordionItem>
                      <AccordionItem key="2" title="Báo cáo bệnh" startContent={<HiOutlineDocumentReport className="text-emerald-500" size={25} />}></AccordionItem>
                    </Accordion>
                  </div>
                </div>
                {treatmentData?.treatmentStages && (
                  <div>
                    <div className="mt-5 mb-3 flex justify-between items-center">
                      <p className="text-xl font-semibold">Các giai đoạn điều trị</p>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" className="capitalize">
                            {filterValue}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Single selection example"
                          variant="flat"
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={filterStatus ? [filterStatus] : []}
                          onSelectionChange={(selectedKeys: any) => {
                            setFilterStatus(selectedKeys.values().next().value);
                          }}
                        >
                          <DropdownItem key="all">Tất cả</DropdownItem>
                          <DropdownItem key="done">Đã tiêm</DropdownItem>
                          <DropdownItem key="not-done">Chưa tiêm</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    {treatmentData?.treatmentStages.length === 0 || filterTreatment(filterStatus).length === 0 ? (
                      <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
                    ) : (
                      filterTreatment(filterStatus)
                        // ?.filter((vaccination: TreatmentStageProps) => vaccination.applyStageTime >= new Date().toISOString())
                        // ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
                        ?.map((stage) => (
                          <div key={stage.id} className="my-4 grid grid-cols-12 p-2 border-2 rounded-xl">
                            <div className="col-span-2 flex items-center justify-center border-r-2">
                              <p className="text-center text-lg p-2">{dateConverter(stage.applyStageTime)}</p>
                            </div>
                            <div className="col-span-2 border-r-2 flex items-center justify-center">
                              <FaClock className="text-lg" />
                              <p className="text-lg p-2">{stage.timeSpan}</p>
                            </div>
                            <div className="col-span-4 border-r-2 mx-3 flex flex-col items-start">
                              <p>Nội dung</p>
                              <p className="text-lg">{stage.title}</p>
                            </div>
                            <div className="col-span-2 border-r-2 mr-3 flex flex-col items-start justify-center">
                              <p>Trạng thái</p>
                              <p className={`text-lg ${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</p>
                            </div>
                            <div className="space-y-2">
                              <Button
                                variant="ghost"
                                color="primary"
                                endContent={<TbMedicineSyrup size={20} />}
                                onPress={() => {
                                  setSelectedVaccination(stage);
                                  getMedicineInStage(stage.id ? stage.id : "");
                                  onOpenDetail();
                                }}
                              >
                                Xem thuốc
                              </Button>
                              {!stage.isDone && (
                                <Button
                                  variant="solid"
                                  color="primary"
                                  endContent={<CiEdit size={20} />}
                                  onPress={() => {
                                    setSelectedVaccination(stage);
                                    onOpenUpdate();
                                  }}
                                >
                                  Cập nhật kết quả
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                    {/* {isOpenDetail && selectedVaccination && medicineList && (
                  <DetailPlan isOpen={isOpenDetail} onClose={onCloseDetail} selectedVaccination={selectedVaccination} medicineList={medicineList} />
                )}
                {isOpenUpdate && selectedVaccination && (
                  <UpdatePlanStatus
                    isOpen={isOpenUpdate}
                    onClose={onCloseUpdate}
                    selectedVaccination={selectedVaccination}
                    setSelectedVaccination={setSelectedVaccination}
                  />
                )} */}
                  </div>
                )}
              </div>
            )}
          </div>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <MdOutlineStickyNote2 size={20} />
              <span className="ml-2">Hướng dẫn điều trị</span>
            </div>
          }
        ></Tab>
        <Tab
          key="3"
          title={
            <div className="flex items-center">
              <PiNotebookDuotone size={20} />
              <span className="ml-2">Từ điển bệnh</span>
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
};

export default Treatment;
