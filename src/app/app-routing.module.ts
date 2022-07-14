import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppScreenComponent } from './pages/app-screen/app-screen.component';
import { ConsoleScreenComponent } from './pages/console-screen/console-screen.component';
import { ExpertScreenComponent } from './pages/expert-screen/expert-screen.component';
import { FavoriteScreenComponent } from './pages/favorite-screen/favorite-screen.component';
import { HomeComponent } from './pages/home/home.component';
import { MainScreenComponent } from './pages/main-screen/main-screen.component';
import { RecentScreenComponent } from './pages/recent-screen/recent-screen.component';
import { SettingScreenComponent } from './pages/setting-screen/setting-screen.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: MainScreenComponent,
        data: {
          title: 'Main Screen'
        }
      },{
        path: 'recents',
        component: RecentScreenComponent,
        data: {
          title: 'Recents'
        }
      },{
        path: 'favorites',
        component: FavoriteScreenComponent,
        data: {
          title: 'Favorites'
        }
      },{
        path: 'consoles',
        component: ConsoleScreenComponent,
        data: {
          title: 'Consoles'
        }
      },{
        path: 'expert',
        component: ExpertScreenComponent,
        data: {
          title: 'Expert'
        }
      },{
        path: 'apps',
        component: AppScreenComponent,
        data: {
          title: 'Apps'
        }
      },{
        path: 'settings',
        component: SettingScreenComponent,
        data: {
          title: 'Settings'
        }
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ],
  },
  {
    path: '**',
    redirectTo: '',
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
