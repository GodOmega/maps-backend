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

  async workerConnected(
    id: number,
    clientId: string,
    roomId: string,
    name: string,
    lastname: string
  ) {
    const employe = await this.employeRepo.findOne(id);

    if (employe) {
      const uuid = uuidv4();
      const response = await this.createWorkerTime({ clientId, employe, uuid });
      const room = this.getRoom(roomId);

      if (response) {
        room.workers.push({
          employeeId: employe.id,
          client: clientId,
          name,
          lastname,
          status: 'online',
          uuid,
        });
      }

      return { room };
    }
  }

  async workerDisconnected(clientId: string) {
    const { room, worker } = this.getRoomByWorker(clientId);
    let newStatus = null;
    let newWorkersArray = null;

    if (worker && room) {
      if (worker.status === 'online') {
        newWorkersArray = room.workers.filter(
          (worker) => worker.client !== clientId,
        );
        newStatus = 'offline';
      }

      if (worker.status === 'lunch') {
        newWorkersArray = room.workers.filter(
          (worker) => worker.client !== clientId,
        );
        newStatus = 'endlunch';
      }

      const employe = await this.employeRepo.findOne(worker.employeeId);
      if (employe) {
        await this.createWorkerTime({
          clientId,
          employe,
          status: newStatus,
          uuid: worker.uuid,
        });
        room.workers = newWorkersArray;
      }
    }

    return room;
  }

  async workerLunch(clientId: string) {
    const { room, worker } = this.getRoomByWorker(clientId);

    if (room && worker) {
      const employe = await this.employeRepo.findOne(worker.employeeId);

      if (employe) {
        const workerIndex = room.workers.findIndex(
          (element) => element.client === clientId,
        );

        if (workerIndex >= 0) {
          await this.createWorkerTime({
            clientId,
            employe,
            status: 'offline',
            uuid: worker.uuid,
          });

          room.workers[workerIndex] = {
            ...worker,
            status: 'lunch',
          };

          await this.createWorkerTime({
            clientId,
            employe,
            status: 'lunch',
            uuid: worker.uuid,
          });
        }

        return { room };
      }
    }
  }

  async createWorkerTime(data: any) {
    const newEmployeTime = this.employeTimeRepo.create(data);
    return await this.employeTimeRepo.save(newEmployeTime);
  }

  getRoomByWorker(clientId: string) {
    let worker = null;

    const room = this.rooms.find((item) => {
      const employee = item.workers.find(
        (worker) => worker.client === clientId,
      );
      worker = employee;
      return employee;
    });

    return { room, worker };
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
    const room = this.getRoom(roomId);
    const workers = room.workers.filter((worker) => worker.status === 'online');

    return workers;
  }
}
