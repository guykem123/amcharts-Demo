import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardControlContentComponent } from './dashboard-control-content.component';

describe('DashboardControlContentComponent', () => {
  let component: DashboardControlContentComponent;
  let fixture: ComponentFixture<DashboardControlContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardControlContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardControlContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
