import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavigation } from './mobile-navigation';

describe('MobileNavigation', () => {
  let component: MobileNavigation;
  let fixture: ComponentFixture<MobileNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
