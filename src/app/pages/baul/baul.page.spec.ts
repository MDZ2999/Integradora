import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaulPage } from './baul.page';

describe('BaulPage', () => {
  let component: BaulPage;
  let fixture: ComponentFixture<BaulPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BaulPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
