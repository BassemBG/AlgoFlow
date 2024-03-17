import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingAlgosComponent } from './sorting-algos.component';

describe('SortingAlgosComponent', () => {
  let component: SortingAlgosComponent;
  let fixture: ComponentFixture<SortingAlgosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortingAlgosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortingAlgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
