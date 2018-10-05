import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { By } from '@angular/platform-browser';
import { Hero } from '../model/hero';
import { getTestHeroes } from '../test-utils-local';
import { click } from '../../test-utils-global';

let fixture: ComponentFixture<DashboardHeroComponent>;
let debugElement: DebugElement;
let dashboardHeroComponent: DashboardHeroComponent;
let heroDebugElement: DebugElement;
let heroElement: HTMLElement;

let expectedHero: Hero;

describe('Tests for DashBoardHeroComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardHeroComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardHeroComponent);
        debugElement = fixture.debugElement;
        dashboardHeroComponent = fixture.componentInstance;
        heroDebugElement = debugElement.query(By.css('.hero'));
        heroElement = heroDebugElement.nativeElement;
        expectedHero = getTestHeroes()[0];
        dashboardHeroComponent.hero = expectedHero;
        fixture.detectChanges();
    });

    it('should display hero name in uppercase', () =>{    
        let expectHeroNameUpperCase = expectedHero.name.toUpperCase();
        expect(heroElement.textContent).toContain(expectHeroNameUpperCase);
    });

    it('should the varible selectHero be equal at hero expect when the hero is clicked', () => {        
        dashboardHeroComponent.selected.subscribe((hero: Hero) => {
            expect(hero).toEqual(expectedHero);
        });
        click(heroDebugElement);
    });
});