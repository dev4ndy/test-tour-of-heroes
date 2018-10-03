import { TestBed, ComponentFixture } from "@angular/core/testing";
import { BannerComponent } from "./banner.component";
import { async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<BannerComponent>;
let debugElement: DebugElement;
let h1: HTMLElement;
let bannerComponent: BannerComponent;
describe('Tests for BannerComponent', () => {
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BannerComponent);
        bannerComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        h1 = debugElement.query(By.css('h1')).nativeElement as HTMLElement;
    });

    describe('When it has not created the compoent', () => {
        it('should the H1 label have empty text', () => {            
            expect(h1.textContent).toBe('');
        });        
    });

    describe('When it has already created the component', () => {
        
        it('should the H1 label have the original title', () => {
            fixture.detectChanges();
            expect(h1.textContent).toBe(bannerComponent.title);
        });

        //This test is no necesary, is only curiosity
        it('should the H1 label be green', () => {
            fixture.detectChanges();
            console.log('styles', h1.style.color); //this is empty 
            //expect(h1.style.color).toBe('green'); this expect fail
            let style = window.getComputedStyle(h1); //This fuction calculates the current styles
            let color = style.getPropertyValue('color');
            expect(color).toBe('rgb(0, 128, 0)');
        });

        it('should display a different test title', () => {
            bannerComponent.title = 'Change the title';
            fixture.detectChanges();
            expect(h1.textContent).toBe(bannerComponent.title);
        });
    });
});