import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { IoMdPricetags } from "react-icons/io";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { useToast } from "@oursrc/hooks/use-toast";
import { apiRequest } from "../../api-request";
import { Cage, HerdInfo, Pig } from "../../models/herd";
import { useForm } from "react-hook-form";

const AssignInfo = ({
  isOpen,
  onClose,
  setAssignedPigs,
}: {
  isOpen: boolean;
  onClose: () => void;
  setAssignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  // const [pig, setPig] = React.useState<Pig>();
  const [tag, setTag] = React.useState<string>(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage>();
  const [height, setHeight] = React.useState<string | undefined>();
  const [width, setWidth] = React.useState<string | undefined>();
  const [weight, setWeight] = React.useState<string | undefined>();
  const [gender, setGender] = React.useState<string | undefined>(undefined);

  const handleHeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setHeight(numericValue);
  };

  const handleWidthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setWidth(numericValue);
  };

  const handleWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setWeight(numericValue);
  };

  const handleAssignPig = async (data: any) => {
    try {
      const herdData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "null");
      const pig = {
        herdId: herdData.id,
        cageId: selectedCage?.id,
        weight: data.weight,
        height: data.height,
        width: data.width,
        code: tag,
        gender: gender,
        note: data.note || "",
      };
      const res: ResponseObject<any> = await apiRequest.assignPigToCage(pig);
      if (res && res.isSuccess) {
        const assignedPig: Pig = {
          id: res.data.id,
          code: res.data.code,
          gender: res.data.gender,
          cage: res.data.cage,
          herdId: res.data.herdId,
          weight: res.data.weight,
          height: res.data.height,
          width: res.data.width,
          note: res.data.note,
        }
        onClose();
        setAssignedPigs((prev) => [...prev, assignedPig]);
        resetData();
        toast({
          variant: "success",
          title: "Gán heo vào chuồng thành công",
        });
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
      console.log(error);
    }
  };

  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity >= cage.capacity) {
      return;
    }
    // check if a cage is already selected
    if (cage.id === selectedCage?.id) {
      setSelectedCage(undefined);
      return;
    }
    setSelectedCage(cage);
  };

  const getCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await apiRequest.getCages(1, 500);
      if (res && res.isSuccess) {
        setCages(res.data.data);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetData = () => {
    setHeight(undefined);
    setWidth(undefined);
    setWeight(undefined);
    setGender(undefined);
    setSelectedCage(undefined);
  }

  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);

  React.useEffect(() => {
    if (isOpen === true) {
      getCages();
    }
  }, [isOpen]);

  return (
    <div>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={() => {
          if (selectedCage && height && width && weight && gender) {
            onClose;
          }
        }}
        hideCloseButton
        scrollBehavior="inside"
      >
        <form onSubmit={handleSubmit(handleAssignPig)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-2xl">Nhập thông tin heo</p>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4 flex items-center">
                <IoMdPricetags className="text-primary" size={30} />
                <p className="ml-2 text-lg">{tag}</p>
              </div>
              <div className="mb-5 flex">
                <Input
                  className="w-1/2 mr-2"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Cân nặng"
                  placeholder="Nhập cân nặng"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={weight ? false : true}
                  errorMessage="Cân nặng không được để trống"
                  value={weight || ""}
                  onValueChange={(e) => handleWeightChange(e)}
                />
                <Select
                  className="w-1/2 ml-2"
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  size="lg"
                  radius="sm"
                  labelPlacement="outside"
                  selectionMode="single"
                  isInvalid={gender ? false : true}
                  errorMessage="Giới tính không được để trống"
                  value={gender || ""}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <SelectItem key={"Male"}>
                    Đực
                  </SelectItem>
                  <SelectItem key={"Female"}>
                    Cái
                  </SelectItem>
                </Select>
              </div>
              <div className="mb-5 flex">
                <Input
                  className="w-1/2 mr-2"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Chiều cao"
                  placeholder="Nhập chiều cao"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={height ? false : true}
                  errorMessage="Chiều cao không được để trống"
                  value={height || ""}
                  onValueChange={(e) => handleHeightChange(e)}
                />
                <Input
                  className="w-1/2 ml-2"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Chiều rộng"
                  placeholder="Nhập chiều rộng"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={width ? false : true}
                  errorMessage="Chiều rộng không được để trống"
                  value={width || ""}
                  onValueChange={(e) => handleWidthChange(e)}
                />
              </div>
              <Textarea
                minRows={5}
                type="text"
                radius="sm"
                size="lg"
                label="Ghi chú"
                placeholder="Nhập ghi chú"
                labelPlacement="outside"
                {...register("note")}
              />
              <p className="text-xl font-semibold">Danh sách chuồng</p>
              <div className="grid grid-cols-2">
                {cages.map((cage) => (
                  <div
                    className={`m-2 border-2 rounded-lg p-2 ${cage.availableQuantity >= cage.capacity ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                      } ${selectedCage?.id === cage.id ? "bg-emerald-200" : ""}`}
                    key={cage.id}
                    onClick={() => handleSelectCage(cage)}
                  >
                    <p className="text-lg">Chuồng: {cage.code}</p>
                    <p className="text-lg">
                      Sức chứa: {cage.availableQuantity}/{cage.capacity}
                    </p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => {
                resetData();
                onClose();
              }}>
                Close
              </Button>
              <Button
                color="primary"
                type="submit"
                isDisabled={selectedCage && height && width && weight && gender ? false : true}
              >
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default AssignInfo;
