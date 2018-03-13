import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering term
      debounceTime(300),
      // ignore new term if same as previous
      distinctUntilChanged(),
      // switch to new search observable each time term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  // Push search term into observable stream
  search(term: string): void {
    this.searchTerms.next(term); // next() does a push/append, not a get
  }

}
