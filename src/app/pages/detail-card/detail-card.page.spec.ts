import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCardPage } from './detail-card.page';

describe('DetailCardPage', () => {
  let component: DetailCardPage;
  let fixture: ComponentFixture<DetailCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
