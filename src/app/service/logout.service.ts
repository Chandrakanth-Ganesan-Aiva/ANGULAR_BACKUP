import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private idle$: Observable<Event> = new Observable();
  private timerSubscription: Subscription = new Subscription();
  private idleSubscription: Subscription = new Subscription();
  private timeoutMilliseconds = 1000;
  private hasExpired = false;
  public expired: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  public startWatching(timeoutSeconds: number): Observable<boolean> {
    this.stopTimer(); // Clear existing timers if any

    const events = [
      'mousemove', 'click', 'mousedown', 'keypress',
      'DOMMouseScroll', 'mousewheel', 'touchmove',
      'MSPointerMove', 'resize'
    ];

    this.idle$ = merge(...events.map(event => fromEvent(document, event)));
    this.timeoutMilliseconds = timeoutSeconds * 1000;
    this.hasExpired = false;

    this.idleSubscription = this.idle$.subscribe({
      next: () => {
        if (!this.hasExpired) {
          this.resetTimer();
        }
      },
      error: err => console.error('Idle event error:', err)
    });

    this.startTimer();
    return this.expired.asObservable();
  }

  private startTimer(): void {
    this.timerSubscription = timer(this.timeoutMilliseconds).subscribe({
      next: () => {
        this.hasExpired = true;
        this.expired.next(true);
      },
      error: err => console.error('Timer error:', err)
    });
  }

  public resetTimer(): void {
    this.timerSubscription.unsubscribe();
    this.startTimer();
  }

  public stopTimer(): void {
    this.timerSubscription.unsubscribe();
    this.idleSubscription.unsubscribe();
  }
}
