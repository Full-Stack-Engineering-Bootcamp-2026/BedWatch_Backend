import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
  ManyToOne,
} from "typeorm";

import { Ward } from "../../ward/entity/ward.entity";

import { Admission } from "../../admission/entity/admission.entity";

import { BedStatusLog } from "../../logs/entity/bedStatusLogs.entity";

export enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  CLEANING = "CLEANING",
}

@Entity("beds")
@Unique(["ward", "bed_number"])
export class Bed {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ward, (ward) => ward.beds)
  ward!: Ward;

  @Column()
  bed_number!: string;

  @Column({
    type: "enum",
    enum: BedStatus,
    default: BedStatus.AVAILABLE,
  })
  status!: BedStatus;

  @OneToMany(() => Admission, (admission) => admission.bed)
  admissions!: Admission[];

  @OneToMany(() => BedStatusLog, (log) => log.bed)
  logs!: BedStatusLog[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
