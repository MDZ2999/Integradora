import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishDetailPage } from './publish-detail.page';

describe('PublishDetailPage', () => {
  let component: PublishDetailPage;
  let fixture: ComponentFixture<PublishDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
