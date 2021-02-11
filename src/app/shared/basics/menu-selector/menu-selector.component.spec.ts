import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSelectorComponent } from './menu-selector.component';

describe('MenuSelectorComponent', () => {
  let component: MenuSelectorComponent;
  let fixture: ComponentFixture<MenuSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
