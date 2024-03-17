import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingAlgosComponent } from './pathfinding-algos.component';

describe('PathfindingAlgosComponent', () => {
  let component: PathfindingAlgosComponent;
  let fixture: ComponentFixture<PathfindingAlgosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathfindingAlgosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathfindingAlgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
