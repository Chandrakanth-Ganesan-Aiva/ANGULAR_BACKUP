import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliergstComponent } from './suppliergst.component';

describe('SuppliergstComponent', () => {
  let component: SuppliergstComponent;
  let fixture: ComponentFixture<SuppliergstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliergstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuppliergstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
