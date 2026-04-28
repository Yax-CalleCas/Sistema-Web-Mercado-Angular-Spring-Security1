import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRecibosComponent } from './mis-recibos.component';

describe('MisRecibosComponent', () => {
  let component: MisRecibosComponent;
  let fixture: ComponentFixture<MisRecibosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisRecibosComponent]
    });
    fixture = TestBed.createComponent(MisRecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
