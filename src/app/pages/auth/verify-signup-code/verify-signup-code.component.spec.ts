import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySignupCodeComponent } from './verify-signup-code.component';

describe('VerifySignupCodeComponent', () => {
  let component: VerifySignupCodeComponent;
  let fixture: ComponentFixture<VerifySignupCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySignupCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifySignupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
