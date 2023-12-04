// IHardwareInfo interface
export interface IHardwareInfo {
    type: string;
    id: string;
    createdAt: string;
    serialNo: string;
    purchaseDate: string;
    warrantyEndDate: string;
    condition: string;
    location: string;
    notes: string;
    manufacturer: string;
    model: string;
    assetTag: string;
    brand: string;
    purchaseOrderNumber: string;
    assignedDate: string;
    retiredDate?: string | null;
    maintenanceSchedule: string;
    assignedBy: string;
    lastServiceDate?: string | null;
    replacementDate?: string | null;
    supportContact: string;
    disposalMethod: string;
}



// ICreateHardwareInfoDto interface
export interface ICreateHardwareInfoDto {
    type: string;
    serialNo: string;
    purchaseDate: string;
    warrantyEndDate: string;
    condition: string;
    location: string;
    notes: string;
    manufacturer: string;
    model: string;
    assetTag: string;
    brand: string;
    purchaseOrderNumber: string;
    assignedDate: string;
    retiredDate?: string | null;
    maintenanceSchedule: string;
    assignedBy: string;
    lastServiceDate?: string | null;
    replacementDate?: string | null;
    supportContact: string;
    disposalMethod: string;
}
