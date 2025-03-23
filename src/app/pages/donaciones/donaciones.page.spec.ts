import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonacionesPage } from './donaciones.page';

describe('DonacionesPage', () => {
  let component: DonacionesPage;
  let fixture: ComponentFixture<DonacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
