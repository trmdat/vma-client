"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  DatePicker,
  DateRangePicker,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  RangeValue,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CalendarDate, getLocalTimeZone, parseDate, parseDateTime, today } from "@internationalized/date";
import MedicineList from "./_components/medicine-list";
import { Medicine } from "@oursrc/lib/models/medicine";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { useToast } from "@oursrc/hooks/use-toast";
import { supplierService } from "@oursrc/lib/services/supplierService";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Supplier } from "@oursrc/lib/models/supplier";
import { BatchCreateProps } from "@oursrc/lib/models/batch";
import { v4 as uuidv4 } from "uuid";
import { Trash, Trash2Icon } from "lucide-react";
import { invoiceService } from "@oursrc/lib/services/invoiceService";
import { useRouter } from "next/navigation";
import { SERVERURL } from "@oursrc/lib/http";

const NewBatch = () => {
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   formState: { errors },
  // } = useForm();
  const { toast } = useToast();
  const router = useRouter();
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>("1");
  const [selectedBatch, setSelectedBatch] = React.useState<BatchCreateProps | undefined>(undefined);
  const [selectedMedicine, setSelectedMedicine] = React.useState<Medicine | undefined>(undefined);
  const [date, setDate] = React.useState<DateValue>();
  const [image, setImage] = React.useState<File | string | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = React.useState<{ title: string; supplierId: string }>({ title: "", supplierId: "" });

  const [batchList, setBatchList] = React.useState<BatchCreateProps[]>([
    {
      id: uuidv4(),
      medicineId: null,
      invoiceId: null,
      quantity: null,
      expiredAt: null,
    },
  ]);

  const handleQuantityChange = (event: string, batch: BatchCreateProps) => {
    setBatchList((prev) => {
      return prev.map((item) => {
        if (item.id === batch.id) {
          let numericValue = event.replace(/[^0-9]/g, "");
          if (numericValue[0] === "-") {
            numericValue = numericValue.slice(1);
          }
          if (parseInt(numericValue) > 1000000) {
            numericValue = "1000000";
          }
          return { ...item, quantity: parseInt(numericValue) };
        }
        return item;
      });
    });
  };

  const handleDateChange = (event: DateValue, batch: BatchCreateProps) => {
    setBatchList((prev) => {
      return prev.map((item) => {
        if (item.id === batch.id) {
          return { ...item, expiredAt: event.toString() };
        }
        return item;
      });
    });
  };

  const isFormFilled = (): boolean => {
    return batchList.some((batch) => !batch.quantity || !batch.expiredAt || !batch.medicineId) || !image || !data.title || !data.supplierId;
  };

  const handleSubmitForm = async () => {
    try {
      if (isFormFilled()) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin cho đợt nhập thuốc",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);
      const jsonBatches = batchList.map((item) => ({ medicineId: item.medicineId, quantity: item.quantity, expiredAt: item.expiredAt }));

      // const formData = new FormData();
      // formData.append("Title", data.title);
      // formData.append("SupplierId", data.supplierId);
      // formData.append("Images", image as Blob);
      // formData.append("JsonBatches", JSON.stringify(jsonBatches));

      const response: ResponseObject<any> = await invoiceService.createInvoiceBatch(data.title, data.supplierId, image as Blob, jsonBatches);
      console.log(response);
      if (response.isSuccess) {
        toast({
          title: "Tạo đợt nhập mới thành công",
          variant: "success",
        });
        router.push("/farmer/medicine");
      } else {
        console.log(response?.errorMessage);
        toast({
          title: "Tạo đợt nhập mới thất bại",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupplier = async () => {
    try {
      const response: ResponseObjectList<Supplier> = await supplierService.getAllSupplier(1, 500);
      if (response.isSuccess) {
        setSuppliers(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedMedicine) {
      setBatchList((prev) => {
        return prev.map((item) => {
          if (item.id === selectedBatch?.id) {
            return { ...item, medicineId: selectedMedicine.id as string | null, medicine: selectedMedicine };
          }
          return item;
        });
      });
      onClose();
    }
  }, [selectedMedicine]);

  useEffect(() => {
    fetchSupplier();
  }, []);

  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      {/* <form onSubmit={handleSubmit(handleSubmitForm)}> */}
      {/* <div className="grid grid-cols-2 gap-3"> */}
      <div className="p-5 my-2 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-xl font-semibold mb-3">Thông tin hóa đơn</p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            className="mb-5"
            type="text"
            radius="md"
            size="lg"
            label="Nội dung hóa đơn"
            placeholder="Nhập nội dung hóa đơn"
            labelPlacement="outside"
            isRequired
            isInvalid={data.title ? false : true}
            errorMessage="Nội dung hóa đơn không được để trống"
            value={data.title || ""}
            onValueChange={(event) => setData({ ...data, title: event })}
            // {...register("title", { required: true })}
          />
          <Select
            label="Nhà cung cấp"
            placeholder="Chọn nhà cung cấp"
            size="lg"
            isRequired
            labelPlacement="outside"
            className="mb-5"
            radius="md"
            isInvalid={data.supplierId ? false : true}
            errorMessage="Chọn nhà cung cấp"
            value={data.supplierId || ""}
            onChange={(event) => setData({ ...data, supplierId: event.target.value })}
            // {...register("supplierId", { required: true })}
          >
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id}>{supplier.name}</SelectItem>
            ))}
          </Select>
        </div>
        <p className="text-lg mb-3">Hình ảnh hóa đơn</p>
        <AttachMedia fileId="1" selectedFile={image} setSelectedFile={setImage} />
        <p className="text-xl font-semibold mb-3">Danh sách các danh mục thuốc cần nhập</p>
        {batchList.map((batch) => (
          <div key={batch.id} className="flex justify-between items-center">
            <div className="p-3 my-3 mx-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg w-full">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  radius="md"
                  size="lg"
                  label="Số luợng"
                  placeholder="Nhập số luợng"
                  labelPlacement="outside"
                  isRequired
                  value={batch.quantity ? batch.quantity.toString() : ""}
                  onValueChange={(event) => handleQuantityChange(event, batch)}
                  isInvalid={batch.quantity ? false : true}
                  errorMessage="Số luợng không được để trống"
                />
                <DatePicker
                  label="Ngày hết hạn"
                  radius="md"
                  size="lg"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={batch.expiredAt ? false : true}
                  errorMessage="Ngày hết hạn không được để trống"
                  minValue={today(getLocalTimeZone())}
                  validationBehavior="native"
                  value={batch.expiredAt ? parseDate(batch.expiredAt.toString()) : null}
                  onChange={(event) => handleDateChange(event, batch)}
                />
              </div>
              <Button
                color="primary"
                variant="solid"
                onPress={() => {
                  setSelectedBatch(batch);
                  onOpen();
                }}
              >
                Chọn thuốc
              </Button>
              {batch.medicineId && batch.medicine && (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p>Tên thuốc:</p>
                    <p className="text-lg font-semibold">{batch.medicine?.name}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p>Đơn vị:</p>
                    <p className="text-lg font-semibold">{batch.medicine?.unit}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p>Thành phần chính:</p>
                    <p className="text-lg font-semibold">{batch.medicine?.mainIngredient}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p>Cách sử dụng:</p>
                    <p className="text-lg font-semibold">{batch.medicine?.usage}</p>
                  </div>
                </div>
              )}
            </div>
            {batchList.length > 1 && <Trash2Icon className="ml-4 text-danger-500" onClick={() => setBatchList(batchList.filter((item) => item.id !== batch.id))} />}
            <Modal size="5xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isDismissable={false}>
              <ModalContent>
                <ModalHeader>
                  <p className="text-xl font-semibold mb-3">Chọn thuốc</p>
                </ModalHeader>
                <ModalBody>
                  <MedicineList
                    selectedMedicine={batchList.find((item) => item.id === selectedBatch?.id)?.medicine || undefined}
                    setSelectedMedicine={setSelectedMedicine}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        ))}
        <div className="mt-3 flex justify-end">
          <Button
            color="primary"
            variant="solid"
            onPress={() => setBatchList([...batchList, { id: uuidv4(), medicineId: null, invoiceId: null, quantity: null, expiredAt: null }])}
          >
            Thêm danh mục thuốc
          </Button>
        </div>
      </div>
      {/* </div> */}
      {/* <div className="mb-2 mt-5 flex">
          <RadioGroup
            onValueChange={(value: string) => {
              setSelected(value);
              if (value === "2") {
                setSelectedMedicine(undefined);
              } else if (value === "1") {
                setValue("medicineName", "");
                setValue("netWeight", "");
                setValue("unit", "");
                setValue("mainIngredient", "");
                setValue("usage", "");
              }
            }}
            value={selected}
            label={<p className="text-2xl text-black dark:text-white font-bold">Chọn loại thuốc</p>}
            className="w-[350px] mr-2"
          >
            <Radio
              className="inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent
          data-[selected=true]:border-primary"
              value="1"
            >
              Thuốc có sẵn trong kho
            </Radio>
            <Radio
              className="inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent
          data-[selected=true]:border-primary"
              value="2"
            >
              Thuốc mới
            </Radio>
          </RadioGroup>
          {selected === "1" && (
            <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <p className="text-xl font-semibold mb-3">Danh sách thuốc trong kho</p>
              <MedicineList selectedMedicine={selectedMedicine || undefined} setSelectedMedicine={setSelectedMedicine} />
            </div>
          )}
          {selected === "2" && (
            <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <p className="text-xl font-semibold mb-3">Nhập thông tin thuốc mới</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Tên thuốc"
                  placeholder="Nhập tên thuốc"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={errors.medicineName ? true : false}
                  errorMessage="Tên thuốc không được để trống"
                  {...register("medicineName", { required: true })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Trọng lượng"
                  placeholder="Nhập trọng lượng"
                  labelPlacement="outside"
                  isRequired
                  // value={netWeight || ""}
                  // onValueChange={(event) => handleNetWeightChange(event)}
                  isInvalid={errors.netWeight && true}
                  errorMessage="Trọng lượng không được để trống"
                  {...register("netWeight", { required: true })}
                />
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Đơn vị"
                  placeholder="Nhập đơn vị"
                  labelPlacement="outside"
                  isRequired
                  // value={unit || ""}
                  isInvalid={errors.unit && true}
                  {...register("unit", { required: true })}
                />
              </div>
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Thành phần chính"
                placeholder="Nhập thành phần chính"
                labelPlacement="outside"
                isRequired
                // value={mainIngredient || ""}
                isInvalid={errors.mainIngredient && true}
                errorMessage="Thành phần chính không được để trống"
                {...register("mainIngredient", { required: true })}
              />
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Cách sử dụng"
                placeholder="Nhập cách sử dụng"
                labelPlacement="outside"
                isRequired
                // value={usage || ""}
                isInvalid={errors.usage && true}
                errorMessage="Cách sử dụng không được để trống"
                {...register("usage", { required: true })}
              />
            </div>
          )}
        </div> */}
      <div className="flex justify-end">
        <Button color="primary" variant="solid" size="lg" isDisabled={isFormFilled()} onPress={handleSubmitForm}>
          Tạo đợt nhập thuốc mới
        </Button>
      </div>
      {/* </form> */}
    </motion.div>
  );
};

export default NewBatch;
