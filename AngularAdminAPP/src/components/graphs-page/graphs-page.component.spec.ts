import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsPageComponent } from './graphs-page.component';

describe('GraphsPageComponent', () => {
  let component: GraphsPageComponent;
  let fixture: ComponentFixture<GraphsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
