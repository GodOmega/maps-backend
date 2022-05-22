import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { Employe } from 'src/enterprise/entities/employe.entity';
import { EmployeTime } from 'src/enterprise/entities/employeTime.entity';

@Injectable()
export class WorkerService {
  private rooms: any[] = [];
  constructor(
    @InjectRepository(Enterprise)
    private enterpriseRepo: Repository<Enterprise>,
    @InjectRepository(Employe) private employeRepo: Repository<Employe>,
    @InjectRepository(EmployeTime)
    private employeTimeRepo: Repository<EmployeTime>,
  ) {}

  async workerConnected(id: number, clientId: string, roomId: string, name: string) {
    const employe = await this.employeRepo.findOne(id);

    if (employe) {
      const response = await this.createWorkerTime({ clientId, employe });
      const room = this.getRoom(roomId);

      console.log(room)
      if (response) {
        room.workers.push({
          employe: employe.id,
          client: clientId,
          name,
          uuid: uuidv4()
        });
      }

      return { room }
    }
  }

  async workerDisconnected(
    employeId: number,
    clientId: string,
    status: string,
  ) {
    const employe = await this.employeRepo.findOne(employeId);

    if (employe) {
      await this.createWorkerTime({ clientId, employe, status });
    }
  }

  async createWorkerTime(data: any) {
    const newEmployeTime = this.employeTimeRepo.create(data);
    return await this.employeTimeRepo.save(newEmployeTime);
  }

  getRoom(roomId: string) {
    const room = this.rooms.find((item) => item.id === roomId);

    if (room) {
      return room;
    }

    this.rooms.push({
      id: roomId,
      workers: [],
    });

    return this.rooms.find((item) => item.id === roomId);
  }

  async getClientsOnline(roomId: string) {
    const room = this.getRoom(roomId)
    console.log('room', room)
    return room.workers
  }
}
