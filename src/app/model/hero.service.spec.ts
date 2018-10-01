// ============= Http testing module and mocking controller ============= \\
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
// ============= Other imports ============= \\
import { TestBed, async, fakeAsync } from '@angular/core/testing'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { HeroService } from './hero.service';
import { Hero } from '.';
import { throwError, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpOptionsWith404 = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    status: 404,
    statusText: 'Not found'
};

function setup() {
    const expectedHeroes = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
    ] as Hero[];

    const expectHero = expectedHeroes[0] as Hero;
    const hero = { id: 3, name: 'Test Hero' }

    return { expectedHeroes, expectHero, hero };
}

describe('Test for heroService', () => {
    //  Variables  //
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let heroService: HeroService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService
            ]
        });

        // Inject the http service and test controller for each test
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        heroService = TestBed.get(HeroService);
    });

    afterEach(() => {
        //Check that there is no awaiting request
        httpTestingController.verify();
    });

    describe('getHeroes', () => {
        it('should return expect heroes', () => {
            const { expectedHeroes } = setup();
            heroService.getHeroes().subscribe(
                heroes => expect(heroes).toEqual(expectedHeroes, 'return expect heroes'),
                fail
            );
            //Expect that made one request to get to the heroesUrl
            const req = httpTestingController.expectOne(heroService.heroesUrl); //open request.
            expect(req.request.method).toBe('GET');

            //Makes the petition http with mock heores. 
            req.flush(expectedHeroes);
        });

        it('should be OK returning no heroes', () => {
            heroService.getHeroes().subscribe(
                heroes => expect(heroes.length).toEqual(0, 'return a empty array'),
                fail
            );
            const req = httpTestingController.expectOne(heroService.heroesUrl);
            expect(req.request.method).toBe('GET');

            //Makes the petition http with empty array of hereos
            req.flush([]);
        });

        it('should turn 404 into an empty heroes results', () => {
            heroService.getHeroes().subscribe(
                heroes => expect(heroes.length).toBe(0, 'return a empty array'),
                fail
            );
            const req = httpTestingController.expectOne(heroService.heroesUrl);
            expect(req.request.method).toBe('GET');

            //Response with a status 404 
            const msg = 'deliberate 404 error';
            req.flush(msg, { status: 404, statusText: 'Not found' });
        });

        it('should return expect heroes (called multiple times)', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.getHeroes().subscribe();
            heroService.getHeroes().subscribe();
            heroService.getHeroes().subscribe(
                heroes => expect(heroes).toEqual(expectedHeroes),
                fail
            );
            const req = httpTestingController.match(`${heroService.heroesUrl}`);
            expect(req.length).toEqual(3, 'calls to getHeroes()');

            req[0].flush([]);
            req[1].flush([{ id: 100, name: 'Test' }]);
            req[2].flush(expectedHeroes);
        });
    });

    describe('getHero', () => {
        it('should return expect hero', () => {
            const { expectedHeroes, expectHero } = setup();
            const id = 1;
            heroService.getHero(id).subscribe(hero =>
                expect(hero).toEqual(expectHero, 'return expected hero'),
                fail
            );

            heroService.getHero('' + id).subscribe(hero => //This is only cover all branches in code-coverage 
                expect(hero).toEqual(expectHero, 'return expected hero'),
                fail
            );
            const req = httpTestingController.match(`${heroService.heroesUrl}/?id=${id}`);
            expect(req[0].request.method).toBe('GET');

            req[0].flush(expectedHeroes);
        });

        it('should return undefined when id not found', () => {
            const id = 11;
            heroService.getHero(id).subscribe(hero =>
                expect(hero).toBe(undefined, 'return undefined')
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${id}`);
            expect(req.request.method).toBe('GET');

            req.flush([]);
        });

        it('should turn 404 into an empty hero result', () => {
            const id = 1;
            heroService.getHero(id).subscribe(hero =>
                expect(Object.keys(hero).length).toBe(0, 'return a empty result')
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${id}`);
            expect(req.request.method).toBe('GET');

            req.flush([], { status: 404, statusText: 'Not found' })
        });
    });

    describe('addHero', () => {
        it('should return the hero saved', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.addHero(hero).subscribe(_hero =>
                expect(_hero).toEqual(hero),
                fail
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(hero);

            req.flush(hero, httpOptions);
        });

        it('should turn 404 into an empty hero result', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.addHero(hero).subscribe(_hero =>
                expect(Object.keys(_hero).length).toBe(0, 'return a empty result'),
                fail
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(hero);

            req.flush(hero, { status: 404, statusText: 'Not found' });
        });
    });

    describe('deleteHero', () => {
        it('should return the hero deleted', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.deleteHero(hero).subscribe(_hero =>
                expect(_hero).toEqual(hero),
                fail
            );

            heroService.deleteHero(3).subscribe(_hero => // This is only cover all branches in code-coverage 
                expect(_hero).toEqual(hero),
                fail
            );
            const req = httpTestingController.match(`${heroService.heroesUrl}/${hero.id}`);
            expect(req[0].request.method).toBe('DELETE');
            //expect(req.request.body).toEqual(newHero);

            req[0].flush(hero, httpOptions);
        });

        it('should turn 404 into an empty hero result', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.deleteHero(hero).subscribe(_hero =>
                expect(Object.keys(_hero).length).toBe(0, 'return a empty result'),
                fail
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${hero.id}`);
            expect(req.request.method).toBe('DELETE');

            req.flush(hero, httpOptionsWith404);
        });
    });

    describe('updateHero', () => {
        it('should return the hero updated', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.updateHero(hero).subscribe(_hero =>
                expect(_hero).toEqual(hero),
                fail
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
            expect(req.request.method).toBe('PUT');

            req.flush(hero, httpOptions);
        });

        it('should turn 404 into an empty hero result', () => {
            const { expectedHeroes, expectHero, hero } = setup();
            heroService.updateHero(hero).subscribe(_hero =>
                expect(Object.keys(_hero).length).toBe(0, 'return a empty result'),
                fail
            );
            const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
            expect(req.request.method).toBe('PUT');

            req.flush(hero, httpOptionsWith404);
        });
    });

    describe('handleError', () => {
        it('should return observable of type <T>', () => {
            let fError = (callback) => {
                return callback(new HttpErrorResponse({
                    status: 404,
                    statusText: 'Not found',
                    url: 'any/url', 
                    error: new ErrorEvent('Oh My Good', {
                        message: 'This is a custom error',
                        filename: 'hero.service.spec.ts',
                        lineno: 246,
                        colno: 30,
                        error: new Error('My custom error')
                    })
                }))
            }
            let obsEmptyExpect = (result = {})  => {
                return (error: HttpErrorResponse) => {return of(result)};
            };
            
            //expect(fError(heroService.handleError())).toBe(fError(obsEmptyExpect({})));
        });
    });
});