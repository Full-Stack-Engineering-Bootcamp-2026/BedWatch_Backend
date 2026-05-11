// export interface CreateTransferDto {
//   "patientId": number;

//   "currentBedId": number;

//   "currentWardId": number;

//   "destinationWardId": number;
// }



export interface CreateTransferDto {
  patientId: number;

  fromBedNumber: string;

  toBedNumber: string;
}