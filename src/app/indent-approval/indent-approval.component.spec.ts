import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentApprovalComponent } from './indent-approval.component';

describe('IndentApprovalComponent', () => {
  let component: IndentApprovalComponent;
  let fixture: ComponentFixture<IndentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndentApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
