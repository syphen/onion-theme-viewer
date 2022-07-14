import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MainScreenComponent } from './pages/main-screen/main-screen.component';
import { RecentScreenComponent } from './pages/recent-screen/recent-screen.component';
import { FavoriteScreenComponent } from './pages/favorite-screen/favorite-screen.component';
import { ConsoleScreenComponent } from './pages/console-screen/console-screen.component';
import { ExpertScreenComponent } from './pages/expert-screen/expert-screen.component';
import { AppScreenComponent } from './pages/app-screen/app-screen.component';
import { SettingScreenComponent } from './pages/setting-screen/setting-screen.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { TipsBarComponent } from './components/tips-bar/tips-bar.component';
import { ImageComponent } from './components/image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainScreenComponent,
    RecentScreenComponent,
    FavoriteScreenComponent,
    ConsoleScreenComponent,
    ExpertScreenComponent,
    AppScreenComponent,
    SettingScreenComponent,
    TitleBarComponent,
    TipsBarComponent,
    ImageComponent
  ],
  imports: [
    ColorPickerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
