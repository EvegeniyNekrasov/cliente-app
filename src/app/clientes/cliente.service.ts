import { Injectable } from '@angular/core';
import { formatDate} from '@angular/common';

import { Cliente } from './cliente';
import { Observable, throwError  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any[]>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) =>{
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map ((response: any) => {
          (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
          return cliente;
        });
        return response;
      })
     );
    }

  
  // ****************** GET CLIENTE **************************
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.console.mensaje);
        swal.fire('Error al editar',e.console.mensaje,'error');
        return throwError(e);
      })
    );
  }
  
  // ****************** CREATE **************************
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status = 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  
  // ****************** UPDATE **************************
  update(cliente: Cliente): Observable<any>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,
     cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if (e.status = 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
     )
  }
  

  // ****************** DELETE **************************
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  // ****************** UPLOAD PHOTO **************************
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo); // Mismo nombre que en Back-End @RequestParam("archivo")
    formData.append("id", id);
  
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
