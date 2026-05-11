import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("forgot_password")
export class ForgotPassword {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  token!: string;

  @Column({
    name: "expires_at",
  })
  expiresAt!: Date;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;
}
