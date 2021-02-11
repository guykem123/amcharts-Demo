import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataNotAvailableComponent } from './data-not-available.component';

describe('DataNotAvailableComponent', () => {
  let component: DataNotAvailableComponent;
  let fixture: ComponentFixture<DataNotAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataNotAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
