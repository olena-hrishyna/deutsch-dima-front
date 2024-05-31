import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RouteHistoryService {
    private prevUrl = '';
    private currUrl = '';
    private history: string[] = [];

    constructor(router: Router) {
        router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => this.setURLs(event as NavigationEnd));
    }

    private setURLs(event: NavigationEnd): void {
        this.prevUrl = this.currUrl;
        this.currUrl = event.urlAfterRedirects;
        this.history.push(event.urlAfterRedirects);
    }

    get previousUrl(): string {
        return this.prevUrl;
    }

    get currentUrl(): string {
        return this.currUrl;
    }

    get routeHistory(): string[] {
        return this.history;
    }
}
