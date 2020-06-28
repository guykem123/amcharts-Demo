import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackVertChartComponent } from './stack-vert-chart.component';

describe('StackVertChartComponent', () => {
  let component: StackVertChartComponent;
  let fixture: ComponentFixture<StackVertChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackVertChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackVertChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
