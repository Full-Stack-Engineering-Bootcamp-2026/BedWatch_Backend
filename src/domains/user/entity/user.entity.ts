import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Ward } from "../../ward/entity/ward.entity";

export enum UserRole {
  STAFF = "STAFF",
  SENIOR_STAFF = "SENIOR_STAFF",
  ADMIN = "ADMIN",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: UserRole })
  role!: UserRole;

  @ManyToOne(() => Ward, (ward) => ward.users, { nullable: true })
  ward!: Ward | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
