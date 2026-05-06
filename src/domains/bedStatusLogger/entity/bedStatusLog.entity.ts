import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Bed } from "../../bed/entity/bed.entity";

export enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  CLEANING = "CLEANING",
}

@Entity("bed_status_logs")
export class BedStatusLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Bed, (bed) => bed.logs)
  bed!: any;

  @Column({
    type: "enum",
    enum: BedStatus,
  })
  status!: BedStatus;

  @CreateDateColumn()
  created_at!: Date;
}
