import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryToolComponent } from './query-tool.component';

describe('QueryToolComponent', () => {
  let component: QueryToolComponent;
  let fixture: ComponentFixture<QueryToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
