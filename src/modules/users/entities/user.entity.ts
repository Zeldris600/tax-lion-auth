import { Otp } from "src/modules/auth/entities/otp.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectId, OneToMany } from "typeorm";


@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    phone: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ default: false })
    isPhoneVerified: boolean; 

    @OneToMany(() => Otp, (otp) => otp.user)
    otps: Otp[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
