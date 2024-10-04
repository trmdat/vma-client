"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";
import MedicinesListReadOnly from "@oursrc/components/medicines/medicines-list-read-only";
import React from "react";
import { useForm } from "react-hook-form";

const AddMedicineToStageModal = ({
  isOpen,
  onOpenChange,
  setSelectedMedicine,
}: any) => {
  const [currentTab, setCurrentTab] = React.useState<React.Key>("existed");
  const [selectedMed, setSelectedMed] = React.useState<{}>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newMedicineName: "",
      isPurchaseNeeded: false,
      portionEachPig: 0,
    },
  });
  const onSubmitNewMedicine = (data: any) => {
    switch (currentTab) {
      case "existed":
        setSelectedMedicine(selectedMed);
        return;
      case "new":
        setSelectedMedicine({
          unit: "",
          name: data.newMedicineName,
          mainIngredient: "",
          quantity: 0,
          registerNumber: 0,
          netWeight: "",
          usage: "",
          batches: [],
        });
        return;
    }
  };
  return (
    <div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {isOpen && (
            <>
              <form onSubmit={handleSubmit(onSubmitNewMedicine)}>
                <ModalHeader className="flex flex-col gap-1">
                  Chọn thuốc cho giai đoạn
                </ModalHeader>
                <ModalBody>
                  <Tabs onSelectionChange={(e) => setCurrentTab(e)}>
                    <Tab key="existed" title="Thuốc trong kho">
                      <MedicinesListReadOnly setSelected={setSelectedMed} />
                    </Tab>
                    <Tab key="new" title="Tạo mới">
                      <div>
                        <Input
                          type="text"
                          label="Tên thuốc mới"
                          isRequired
                          isInvalid={errors.newMedicineName ? true : false}
                          errorMessage="Tên thuốc mới không được để trống"
                          {...register("newMedicineName")}
                        />
                        {/* <Switch
                          defaultSelected
                          size="md"
                          {...register("isPurchaseNeeded")}
                        >
                          Yêu cầu mua mới
                        </Switch> */}
                        {/* <Input
                          type="number"
                          label="Số lượng liều mỗi con"
                          isRequired
                          isInvalid={errors.portionEachPig ? true : false}
                          errorMessage="Số lượng liều mỗi con không được để trống"
                          {...register("portionEachPig", { required: true })}
                        /> */}
                      </div>
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                  <div className="flex justify-end">
                    <Button
                      variant="solid"
                      color="primary"
                      size="lg"
                      type="submit"
                    >
                      <p className="text-white">Xác nhận</p>
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default AddMedicineToStageModal;
