import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { PremiumUserGuard } from 'src/app/guards/premium-user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-camera-dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardPage,
    children:[
      {
        path: 'history',
        // canActivate:[PremiumUserGuard],
        loadChildren: () => import('../history/history.module').then( m => m.HistoryPageModule)
      },
      {
        path: 'chat-with-ai',
        // canActivate:[PremiumUserGuard],
        loadChildren: () => import('../chat-bot/chat-bot.module').then( m => m.ChatBotPageModule)
      },
      {
        path: 'main-camera-dashboard',
        loadChildren: () => import('../main-camera-dashboard/main-camera-dashboard.module').then( m => m.MainCameraDashboardPageModule)
      },
      {
        path: 'open-source-libraries',
        loadChildren: () => import('../open-source-libraries/open-source-libraries.module').then( m => m.OpenSourceLibrariesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
