import React from "react";
import { Finding } from "../../types";
import { DefectDrillDownModal } from "./DefectDrillDownModal";

interface EvidenceModalProps {
  finding: Finding | null;
  onClose: () => void;
  onToggleVerification: (findingId: number) => void;
  onToggleResolved?: (findingId: number) => void;
  onUpdateNotes?: (findingId: number, notes: string) => void;
  isArabic?: boolean;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  finding,
  onClose,
  onToggleVerification,
  onToggleResolved = () => {},
  onUpdateNotes,
  isArabic = false,
}) => {
  return (
    <DefectDrillDownModal
      finding={finding}
      onClose={onClose}
      onToggleVerification={onToggleVerification}
      onToggleResolved={onToggleResolved}
      onUpdateNotes={onUpdateNotes}
      isArabic={isArabic}
    />
  );
};
