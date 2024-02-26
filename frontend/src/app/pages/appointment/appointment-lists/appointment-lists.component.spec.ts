import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListsComponent } from './appointment-lists.component';

describe('AppointmentListsComponent', () => {
  let component: AppointmentListsComponent;
  let fixture: ComponentFixture<AppointmentListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
