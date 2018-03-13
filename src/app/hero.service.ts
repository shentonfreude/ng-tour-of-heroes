import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; // lowercase
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  private heroesUrl = 'api/heroes'; // URL to the web API

  // Log a HeroService message with the MessageService
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  getHeroes(): Observable<Hero[]> {
    // if the interesting data were buried in the response
    // we'd want to use a RxJS `map` operator to extract it
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes', []))
      );
  }

  // Handle Http operation that failed, let the app continue.
  // @param operation - name of operation that failed
  // @ param result - optional value to return as the observable result
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO send error to remote logging infrastructure
      console.error(error);     // log to console
      // TODO: better job transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let app keep running by returning empty result
      return of(result as T);
    };
  }

  // Get hero by id; 404 if id not found
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  // Update the hero on the server with PUT
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // add new hero to server with POST
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  // delete hero from server with DELETE
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    this.log(`deletehero id=${id} url=${url}`);

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

}
