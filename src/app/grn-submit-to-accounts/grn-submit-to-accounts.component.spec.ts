import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnSubmitToAccountsComponent } from './grn-submit-to-accounts.component';

describe('GrnSubmitToAccountsComponent', () => {
  let component: GrnSubmitToAccountsComponent;
  let fixture: ComponentFixture<GrnSubmitToAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrnSubmitToAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrnSubmitToAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
