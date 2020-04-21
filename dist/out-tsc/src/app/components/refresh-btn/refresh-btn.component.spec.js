import { async, TestBed } from '@angular/core/testing';
import { RefreshBtnComponent } from './refresh-btn.component';
describe('RefreshBtnComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RefreshBtnComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(RefreshBtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=refresh-btn.component.spec.js.map