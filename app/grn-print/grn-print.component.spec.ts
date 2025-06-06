import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnPrintComponent } from './grn-print.component';

describe('GrnPrintComponent', () => {
  let component: GrnPrintComponent;
  let fixture: ComponentFixture<GrnPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrnPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrnPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
