// ============= Http testing module and mocking controller ============= \\
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
// ============= Other imports ============= \\
import { TestBed } from '@angular/core/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { HeroService } from './hero.service';
import { Hero } from '.';

function setup() {
    const expectedHeroes = [
        { id: 1, name: 'Test 1' },
        { id: 1, name: 'Test 2' }
    ] as Hero[];
    return { expectedHeroes };
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
            const { expectedHeroes } = setup();
            heroService.getHeroes().subscribe();
            heroService.getHeroes().subscribe();
            heroService.getHeroes().subscribe(
                heroes => expect(heroes).toEqual(expectedHeroes);
            );
    });

});
});