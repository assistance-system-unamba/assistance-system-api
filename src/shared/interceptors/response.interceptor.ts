// src/shared/interceptors/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload: any) => {
        // Si ya viene en el formato estándar, respétalo
        if (payload && typeof payload === 'object'
            && 'success' in payload && 'message' in payload) {
          return payload;
        }

        // Si viene con __message, úsalo como message y el resto como data
        if (payload && typeof payload === 'object' && '__message' in payload) {
          const { __message, ...rest } = payload;
          const hasRest = rest && Object.keys(rest).length > 0;
          return {
            success: true,
            message: String(__message),
            data: hasRest ? rest : null,
          };
        }

        // Por defecto
        return {
          success: true,
          message: 'Operación exitosa',
          data: payload ?? null,
        };
      }),
    );
  }
}
