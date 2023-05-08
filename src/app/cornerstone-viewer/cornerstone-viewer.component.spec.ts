import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CornerstoneViewerComponent } from './cornerstone-viewer.component';

describe('CornerstoneViewerComponent', () => {
  let component: CornerstoneViewerComponent;
  let fixture: ComponentFixture<CornerstoneViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CornerstoneViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CornerstoneViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
