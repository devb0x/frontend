import { Routes } from '@angular/router'
import { AuthGuard } from "./auth/auth.guard"
import { ArmyEditGuard } from "./pages/army/army-edit/army-edit.guard"

import { NotFoundComponent } from "./pages/not-found/not-found.component"
import { LoginComponent } from "./auth/login/login.component"
import { RegisterComponent } from "./auth/register/register.component"
import { DashboardComponent } from "./pages/dashboard/dashboard.component"
import { NewArmyComponent } from "./components/features/new-army/new-army.component"
import { ArmyComponent } from "./pages/army/army.component"
import { ArmyEditComponent } from "./pages/army/army-edit/army-edit.component"

import {ArmyResolver} from "./resolvers/army.resolver";
import {MiniatureResolver} from "./resolvers/miniature.resolver";
import {PaintGuideResolver} from "./resolvers/paint-guide.resolver";

import {HomepageComponent} from "./pages/homepage/homepage.component";
import {MiniatureComponent} from "./pages/miniature/miniature.component";
import {MiniatureEditComponent} from "./pages/miniature/miniature-edit/miniature-edit.component";
import {MiniatureStepEditComponent} from "./pages/miniature/miniature-step-edit/miniature-step-edit.component";
import {ArmiesComponent} from "./pages/armies/armies.component";
import {SearchResultsComponent} from "./pages/search-results/search-results.component";
import {ConfirmRegistrationComponent} from "./auth/confirm-registration/confirm-registration.component";
import {VerifyAccountComponent} from "./auth/verify-account/verify-account.component";
import {RetrievePasswordComponent} from "./auth/retrieve-password/retrieve-password.component";
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {NewPaintGuideComponent} from "./components/features/new-paint-guide/new-paint-guide.component";
import {PaintGuideComponent} from "./pages/paint-guide/paint-guide.component";
import {PaintGuideEditComponent} from "./pages/paint-guide/paint-guide-edit/paint-guide-edit.component";
import {PaintGuideEditGuard} from "./pages/paint-guide/paint-guide-edit/paint-guide-edit.guard";
import {PaintGuidesComponent} from "./pages/paint-guides/paint-guides.component";

export const routes: Routes = [
	{
		path: '',
		component: HomepageComponent,
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		children: [
			{
				path: '',
				component: RegisterComponent
			},
			{
				path: 'account-confirmation/:token',
				component: ConfirmRegistrationComponent
			},
			{
				path: 'verify-account',
				component: VerifyAccountComponent
			}
		]
	},
	{
		path: 'retrieve-password',
		component: RetrievePasswordComponent
	},
	{
		path: 'reset-password/:token',
		component: ResetPasswordComponent
	},
	{
		path: 'dashboard',
		canActivateChild: [AuthGuard], // Use canActivateChild for child routes
		children: [
			{
				path: '', // Empty path for '/dashboard'
				component: DashboardComponent,
			},
			{
				path: 'new-army',
				component: NewArmyComponent
			},
			{
				path: 'new-paint-guide',
				component: NewPaintGuideComponent
			}
		]
	},
	{
		path: 'profile/:memberNumber',
		component: ProfileComponent,
		resolve: { armyData: ArmyResolver }
	},
	{
		path: 'army/:armyId',
		children: [
			{
				path: '',
				component: ArmyComponent
			},
			{
				path: 'miniature/:miniatureId',
				component: MiniatureComponent,
				resolve: {
					miniatureData: MiniatureResolver,
					armyData: ArmyResolver
				}
			},
			{
				path: 'miniature/edit/:miniatureId',
				component: MiniatureEditComponent,
				canActivate: [AuthGuard, ArmyEditGuard],
				resolve: {
					miniatureData: MiniatureResolver,
					armyData: ArmyResolver
				}
			},
			{
				path: 'miniature/edit/:miniatureId/edit-step/:stepNumber',
				component: MiniatureStepEditComponent,
				canActivate: [AuthGuard, ArmyEditGuard],
				resolve: {
					miniatureData: MiniatureResolver,
					armyData: ArmyResolver
				},
				runGuardsAndResolvers: 'always'
			}
		],
	},
	{
		path: 'army/edit/:armyId',
		component: ArmyEditComponent,
		canActivate: [AuthGuard, ArmyEditGuard],
		resolve: { armyData: ArmyResolver }
	},
	{
		path: 'paint-guide/:paintGuideId',
		component: PaintGuideComponent,
		resolve: { paintGuideData: PaintGuideResolver }
	},
	{
		path: 'paint-guide/edit/:paintGuideId',
		component : PaintGuideEditComponent,
		canActivate: [AuthGuard, PaintGuideEditGuard],
		resolve: { paintGuideData: PaintGuideResolver }
	},
	{
		path: 'armies',
		component: ArmiesComponent
	},
	{
		path: 'paint-guides',
		component: PaintGuidesComponent
	},
	{
		path: 'search-results',
		component: SearchResultsComponent
	},
	{
		path: '404',
		component: NotFoundComponent
	},
	{
		path: '**',
		redirectTo: '/404',
	}
];
