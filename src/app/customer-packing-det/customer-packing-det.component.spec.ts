import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPackingDetComponent } from './customer-packing-det.component';

describe('CustomerPackingDetComponent', () => {
  let component: CustomerPackingDetComponent;
  let fixture: ComponentFixture<CustomerPackingDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPackingDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerPackingDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
