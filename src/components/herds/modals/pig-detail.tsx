import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import CommonTreatmentPlanList from "@oursrc/components/treatment/common-treatment-plan-list";
import CommonVaccinationList from "@oursrc/components/vaccination/common-vaccination-list";
import CommonVaccinationStageList from "@oursrc/components/vaccination/common-vaccination-stage-list";
import { Pig } from "@oursrc/lib/models/pig";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import React from "react";
import { TbVaccine } from "react-icons/tb";
import DevelopmentLogList from "../../../app/(management)/farm-assist/herd/_components/development-log-list";
import PigDiseaseReportList from "@oursrc/components/disease-reports/pig-disease-report-list";
import { TreatmentData } from "@oursrc/lib/models/treatment";

const PigDetail = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
  const [currentStages, setCurrentStages] = React.useState<VaccinationStageProps[]>([]);
  const [treatment, setSelectedTreatment] = React.useState<TreatmentData>();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        wrapper: "w-full h-fit",
      }}
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">Chi tiết heo [{pigInfo?.pigCode}]</p>
        </ModalHeader>
        <ModalBody>
          <DevelopmentLogList selectedPig={pigInfo as Pig} />
          <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <TbVaccine size={20} />
                  <span className="ml-2">Thông tin tiêm phòng</span>
                </div>
              }
            >
              <div>
                <CommonVaccinationList pigId={pigInfo.id} setCurrentStages={setCurrentStages} />
                <CommonVaccinationStageList stages={currentStages} />
              </div>
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <ClipboardCheck size={20} />
                  <span className="ml-2">Thông tin chữa bệnh</span>
                </div>
              }
            >
              <div>
                <CommonTreatmentPlanList pigId={pigInfo.id} setSelectedTreatment={setSelectedTreatment} />
              </div>
            </Tab>
            <Tab
              key="3"
              title={
                <div className="flex items-center">
                  <ClipboardList size={20} />
                  <span className="ml-2">Báo cáo bệnh</span>
                </div>
              }
            >
              <div>
                <PigDiseaseReportList pigId={pigInfo.id} />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PigDetail;
