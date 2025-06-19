import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreReqMatlDetComponent } from './store-req-matl-det.component';

describe('StoreReqMatlDetComponent', () => {
  let component: StoreReqMatlDetComponent;
  let fixture: ComponentFixture<StoreReqMatlDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreReqMatlDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreReqMatlDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
