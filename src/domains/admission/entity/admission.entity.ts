import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { Patient } from "../../patient/entity/patient.entity";

import { Bed } from "../../bed/entity/bed.entity";

import { User } from "../../user/entity/user.entity";


export enum AdmissionStatus {
  ACTIVE = "ACTIVE",
  DISCHARGED = "DISCHARGED",
}

@Entity("admissions")
export class Admission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Patient)
  patient!: Patient;

  @ManyToOne(() => Bed, (bed) => bed.admissions)
  bed!: Bed;

  @ManyToOne(() => User)
  admitted_by!: User;

  @CreateDateColumn()
  admitted_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  discharged_at!: Date | null;

  @Column({
    type: "enum",
    enum: AdmissionStatus,
    default: AdmissionStatus.ACTIVE,
  })
  status!: AdmissionStatus;
}
