import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HighlightDirective } from "../shared/highlight.directive";
import { AboutComponent } from "./about.component";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

let fixture: ComponentFixture<AboutComponent>;
let debugElement: DebugElement;

describe('Tests for AboutComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AboutComponent, HighlightDirective],
            schemas:[NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(AboutComponent);
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should paint of skyblue the tag <h2>', () => {
        let h2 = debugElement.query(By.css('h2')).nativeElement as HTMLElement;
        expect(h2.style.backgroundColor).toBe('skyblue');
    });
})