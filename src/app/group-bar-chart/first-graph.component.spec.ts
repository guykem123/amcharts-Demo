import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstGraphComponent } from './first-graph.component';

describe('FirstGraphComponent', () => {
  let component: FirstGraphComponent;
  let fixture: ComponentFixture<FirstGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
