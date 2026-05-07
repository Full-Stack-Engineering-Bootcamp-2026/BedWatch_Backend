import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

import { Bed } from "../../bed/entity/bed.entity";
import { User } from "../../user/entity/user.entity";

@Entity("wards")
export class Ward {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: true })
  name!: string;

  @Column()
  type!: string;

  @Column()
  capacity!: number;

  @OneToMany(() => Bed, (bed) => bed.ward)
  beds!: Bed[];

  // //check
  // @ManyToOne(() => User, (user) => user.ward)
  // users!: User[];
  @OneToMany(() => User, (user) => user.ward)
  users!: User[];

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
