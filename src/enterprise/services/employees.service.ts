import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const moment = require('moment');

import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  GetEmployeeTime,
  GetEmployeesWithTime,
  GetEmployeeTimeByWeek,
} from '../dtos/employe.dto';
import { Employe } from '../entities/employe.entity';
import { EmployeTime } from '../entities/employeTime.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employe) private employeRepo: Repository<Employe>,
    @InjectRepository(EmployeTime)
    private employeeTimeRepo: Repository<EmployeTime>,
  ) {}

  async findOne(id: number) {
    const employee = await this.employeRepo.findOne(id);
    console.log(employee);
    return employee;
  }

  async getEmployeeWithTime(data: GetEmployeeTime) {
    const { email, enterpriseId } = data;

    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();

    const employee = await this.employeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .where('employee.enterprises_id = :enterpriseId', { enterpriseId })
      .andWhere('user.email = :email', { email })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }
    const employeeTimes = await this.employeeTimeRepo
      .createQueryBuilder('employeeTime')
      .where('employeeTime.employe_id = :id', { id: employee.id })
      .where('employeeTime.time BETWEEN :start AND :end', { start, end })
      .getMany();

    const order = this.orderEmployeeTimes(employeeTimes);
    const employeeTime = this.calculateEmployeeTime(order);

    const name = employee.user.name;
    const lastname = employee.user.lastname;

    delete employee.user;

    return { ...employee, name, lastname, ...employeeTime };
  }

  orderEmployeeTimes(employeeTimes: EmployeTime[] = []) {
    if (employeeTimes.length) {
      let hashUuid = {};
      for (const time of employeeTimes) {
        if (hashUuid[time.uuid]) {
          continue;
        }

        const allTimes = employeeTimes.filter(
          (item) => item.uuid === time.uuid,
        );

        hashUuid[time.uuid] = allTimes;
      }

      return hashUuid;
    }

    return {};
  }

  calculateEmployeeTime(timesOrdered: any) {
    let workTimeMinutes = 0;
    let lunchTimeMinutes = 0;

    for (const key in timesOrdered) {
      const timesArray = timesOrdered[key];

      let onlineDate: any = '';
      let offlineDate: any = '';
      let lunch: any = '';
      let endlunch: any = '';

      let timeInMinutes = 0;

      let lunchInMinutes = 0;

      for (const item of timesArray) {
        if (item.status === 'online') {
          onlineDate = moment(item.time);
          if (offlineDate) {
            timeInMinutes = offlineDate.diff(onlineDate, 'minutes');
          }
        }

        if (item.status === 'offline') {
          offlineDate = moment(item.time);

          if (onlineDate) {
            timeInMinutes = offlineDate.diff(onlineDate, 'minutes');
          }
        }

        // LUNCH TIME

        if (item.status === 'lunch') {
          lunch = moment(item.time);

          if (endlunch) {
            lunchInMinutes = endlunch.diff(lunch, 'minutes');
          }
        }

        if (item.status === 'endlunch') {
          endlunch = moment(item.time);

          if (lunch) {
            lunchInMinutes = endlunch.diff(lunch, 'minutes');
          }
        }
      }

      workTimeMinutes += timeInMinutes;

      lunchTimeMinutes += lunchInMinutes;
    }
    
    const hoursWork = Math.floor(workTimeMinutes / 60);
    const minutesWork = workTimeMinutes % 60 ;
    

    const hoursLunch = Math.floor(lunchTimeMinutes / 60);
    const minutesLunch = lunchTimeMinutes % 60 ;

    return {
      workTime: `${hoursWork}h:${minutesWork}m`,
      lunchTime: `${hoursLunch}h:${minutesLunch}m`
    };
  }

  async getEmployeesWithTime(data: GetEmployeesWithTime) {
    const { enterpriseId } = data;

    const employees = await this.employeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .where('employee.enterprises_id = :enterpriseId', { enterpriseId })
      .getMany();

    if (!employees.length) {
      return employees;
    }

    let employeesWithTime = [];
    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();

    for (const employee of employees) {
      const employeeTimes = await this.employeeTimeRepo
        .createQueryBuilder('employeeTime')
        .where('employeeTime.employe_id = :id', { id: employee.id })
        .andWhere('employeeTime.time BETWEEN :start AND :end', { start, end })
        .getMany();

      const order = this.orderEmployeeTimes(employeeTimes);
      const employeeTime = this.calculateEmployeeTime(order);

      const name = employee.user.name;
      const lastname = employee.user.lastname;

      delete employee.user;

      const employeeWithTime = {
        employee,
        name,
        lastname,
        employeeTime,
      };

      employeesWithTime = [...employeesWithTime, employeeWithTime];
    }

    return employeesWithTime;
  }

  async getEmployeeTimeByMonth(data: GetEmployeeTime) {
    const { email, enterpriseId} = data;
    const start = moment().startOf('month').toDate();
    const end = moment().endOf('month').toDate();

    const employee = await this.employeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .where('employee.enterprises_id = :enterpriseId', { enterpriseId })
      .andWhere('user.email = :email', { email })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }
    const employeeTimes = await this.employeeTimeRepo
      .createQueryBuilder('employeeTime')
      .where('employeeTime.employe_id = :id', { id: employee.id })
      .andWhere('employeeTime.time BETWEEN :start AND :end', { start, end })
      .getMany();

    const order = this.orderEmployeeTimes(employeeTimes);
    const employeeTime = this.calculateEmployeeTime(order);

    const name = employee.user.name;
    const lastname = employee.user.lastname;

    delete employee.user;

    return { ...employee, name, lastname, ...employeeTime };
  }

  async getEmployeeTimeByWeek(data: GetEmployeeTimeByWeek) {
    const { email, enterpriseId, startDate, endDate} = data;
    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    const employee = await this.employeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .where('employee.enterprises_id = :enterpriseId', { enterpriseId })
      .andWhere('user.email = :email', { email })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }
    const employeeTimes = await this.employeeTimeRepo
      .createQueryBuilder('employeeTime')
      .where('employeeTime.employe_id = :id', { id: employee.id })
      .andWhere(`employeeTime.time BETWEEN :start AND date_sub(:end , interval 1 HOUR)`, { start, end })
      .getMany();


    const order = this.orderEmployeeTimes(employeeTimes);
    const employeeTime = this.calculateEmployeeTime(order);  

    const name = employee.user.name;
    const lastname = employee.user.lastname;

    delete employee.user;

    return { ...employee, name, lastname, ...employeeTime };

  }

  create(data: CreateEmployeeDto) {
    const employe = this.employeRepo.create(data);
    return this.employeRepo.save(employe);
  }

  async update(id: number, changes: UpdateEmployeeDto) {
    const employe = await this.employeRepo.findOne(id);
    this.employeRepo.merge(employe, changes);
  }

  async delete(id: number) {
    return this.employeRepo.delete(id);
  }
}
