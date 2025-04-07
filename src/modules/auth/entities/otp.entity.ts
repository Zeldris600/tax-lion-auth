import { ObjectId } from 'mongodb';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ObjectIdColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  
  @Entity()
  export class Otp {
   @ObjectIdColumn()
    id: ObjectId;
  
    @Column()
    @Index()
    phone: string;

    @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'userId' })
  user: User;

  
    @Column()
    code: string;
  
    @Column()
    channel: string; // e.g. whatsapp, sms, email (future-proofing)
  
    @Column({ type: 'bigint' })
    expiresAt: number;
  
    @Column({ default: false })
    verified: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  