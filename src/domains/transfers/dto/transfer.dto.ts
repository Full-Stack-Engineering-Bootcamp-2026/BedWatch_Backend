export interface CreateTransferDto {
  patientId: number;

  currentBedId: number;

  currentWardId: number;

  destinationWardId: number;
}