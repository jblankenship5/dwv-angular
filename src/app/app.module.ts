import { NgModule } from '@angular/core';
import { DwvModule } from './dwv/dwv.module';


import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CornerstoneViewerComponent } from './cornerstone-viewer/cornerstone-viewer.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';

@NgModule({
  declarations: [AppComponent, CornerstoneViewerComponent],
  imports: [RouterModule.forRoot([]), FormsModule,
    ReactiveFormsModule, MatSliderModule, DwvModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  bootstrap: [AppComponent],
  // providers: [
  //   // list of services to be registered
  //   ActivatedRoute
  // ],
})

export class AppModule {}
