import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json'; // created for testing  
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ClienteService {

  // Url to connect to the endpoint of backend
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]>{

    // This will return en cliente json list
    //return of(CLIENTES); 
    return this.http.get(this.urlEndPoint).pipe(
      map (response => response as Cliente[])
     );
    }
}
