// src/modules/attendance/infrastructure/zkteco/attendance-events.service.ts
import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class AttendanceEventsService {
  private subject = new Subject<MessageEvent>();

  /** Publicar un nuevo log en el stream */
  publish(data: any) {
    this.subject.next({ data });
  }

  /** Retornar observable SSE */
  getStream(): Observable<MessageEvent> {
    return this.subject.asObservable();
  }
}
