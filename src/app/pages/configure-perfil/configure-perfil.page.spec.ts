import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurePerfilPage } from './configure-perfil.page';

describe('ConfigurePerfilPage', () => {
  let component: ConfigurePerfilPage;
  let fixture: ComponentFixture<ConfigurePerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
