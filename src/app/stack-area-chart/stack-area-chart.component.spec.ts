import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackAreaChartComponent } from './stack-area-chart.component';

describe('StackAreaChartComponent', () => {
  let component: StackAreaChartComponent;
  let fixture: ComponentFixture<StackAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
