import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender!: Gender;

  @Column()
  reason!: string;

  @Column()
  notes!: string;

  @Column()
  admittingDoctor!: string;

  @CreateDateColumn()
  created_at!: Date;
}
