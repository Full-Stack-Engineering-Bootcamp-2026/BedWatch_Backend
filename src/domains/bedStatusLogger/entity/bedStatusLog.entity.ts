import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

import { Bed } from "../../bed/entity/bed.entity";
import { User } from "../../user/entity/user.entity";
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
@JoinColumn({ name: "bed_id" })
bed!: Bed;
  
@ManyToOne(() => User)
@JoinColumn({ name: "changed_by_id" })
changed_by!: User;

  @Column({
    type: "enum",
    enum: BedStatus,
  })
  status!: BedStatus;

  @CreateDateColumn()
  created_at!: Date;
}
