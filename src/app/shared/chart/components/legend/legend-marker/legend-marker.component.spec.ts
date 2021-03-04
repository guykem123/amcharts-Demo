import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendMarkerComponent } from './legend-marker.component';

describe('LegendMarkerComponent', () => {
  let component: LegendMarkerComponent;
  let fixture: ComponentFixture<LegendMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
