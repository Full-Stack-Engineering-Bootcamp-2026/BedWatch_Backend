import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Patient } from "../../patient/entity/patient.entity";
import { Bed } from "../../bed/entity/bed.entity";
import { User } from "../../user/entity/user.entity";

export enum TransferStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@Entity("transfers")
export class Transfer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Patient)
  patient!: Patient;

  @ManyToOne(() => Bed)
  from_bed!: Bed;

  @ManyToOne(() => Bed)
  to_bed!: Bed;

  @ManyToOne(() => User)
  requested_by!: User;

  @ManyToOne(() => User, { nullable: true })
  approved_by!: User | null;

  @Column({
    type: "enum",
    enum: TransferStatus,
    default: TransferStatus.PENDING,
  })
  status!: TransferStatus;

  @CreateDateColumn()
  requested_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at!: Date | null;
}
