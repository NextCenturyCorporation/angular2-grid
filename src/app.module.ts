// Standard module imports
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Application component
import { NgGridModule } from './modules/NgGrid.module';
import { MyAppComponent }  from './app.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ MyAppComponent ],
  providers: [],
  bootstrap: [ MyAppComponent ]
})
export class MyAppModule { }