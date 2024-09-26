import React from "react";
import { Cage, Pig } from "./assign-tag";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IoMdPricetags } from "react-icons/io";

const AssignInfo = ({
  isOpen,
  onClose,
  selectedPig,
  setSelectedPig,
  setUnassignedPigs,
  setAssignedPigs,
  unassignedPigs,
  assignedPigs,
  cages,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPig: Pig;
  setSelectedPig: React.Dispatch<React.SetStateAction<Pig | undefined>>;
  setUnassignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  setAssignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  unassignedPigs: Pig[];
  assignedPigs: Pig[];
  cages: Cage[];
}) => {
  const [height, setHeight] = React.useState<string | undefined>();
  const [width, setWidth] = React.useState<string | undefined>();

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

  const handleAssignPig = (pig: Pig) => {
    setUnassignedPigs(unassignedPigs.filter((p) => p.id !== pig.id));
    setAssignedPigs([...assignedPigs, pig]);
  };
  const handleSelectCage = (cage: Cage) => {
    if (selectedPig.cage?.id === cage.id) {
      setSelectedPig({ ...selectedPig, cage: undefined });
    } else {
      if (cage.currentQuantity >= cage.capacity) {
        return;
      }
      setSelectedPig({ ...selectedPig, cage: cage });
    }
  };

  React.useEffect(() => {
    setSelectedPig({
      ...selectedPig,
      height: Number(height),
      width: Number(width),
    });
  }, [height, width]);

  return (
    <div>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={() => {
          if (selectedPig.cage && height && width) {
            onClose;
          }
        }}
        hideCloseButton
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-2xl">Thông tin heo</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-lg">Mã heo: {selectedPig?.name}</p>
            <div className="mb-4 flex items-center">
              <IoMdPricetags className="text-primary" size={30} />
              <p className="ml-2 text-lg">HE01CA01PI01</p>
            </div>
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Cân nặng"
              placeholder="Nhập cân nặng"
              labelPlacement="outside"
              isRequired
              value={selectedPig?.weight?.toString() || "0"}
              onValueChange={(e) =>
                setSelectedPig({ ...selectedPig, weight: Number(e) })
              }
            />
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
            <p className="text-xl font-semibold">Danh sách chuồng</p>
            <div className="grid grid-cols-2">
              {cages.map((cage) => (
                <div
                  className={`m-2 border-2 rounded-lg p-2 ${
                    selectedPig?.cage?.id === cage.id ? "bg-primary" : ""
                  } ${
                    cage.currentQuantity >= cage.capacity
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  key={cage.id}
                  onClick={() => handleSelectCage(cage)}
                >
                  <p className="text-lg">{cage.name}</p>
                  <p className="text-lg">
                    Sức chứa: {cage.currentQuantity}/{cage.capacity}
                  </p>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                handleAssignPig(selectedPig);
                onClose();
              }}
              isDisabled={selectedPig?.cage && height && width ? false : true}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignInfo;