package Athari.marketingcommandcenter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.navigation.AdaptiveNavigationShell
import Athari.marketingcommandcenter.ui.navigation.NavigationItem
import Athari.marketingcommandcenter.ui.screens.campaigns.CampaignScreen
import Athari.marketingcommandcenter.ui.screens.dashboard.DashboardScreen
import Athari.marketingcommandcenter.ui.screens.features.CalendarScreen
import Athari.marketingcommandcenter.ui.screens.features.CrmScreen
import Athari.marketingcommandcenter.ui.screens.features.PerformanceScreen
import Athari.marketingcommandcenter.ui.screens.features.ReportsScreen
import Athari.marketingcommandcenter.ui.screens.features.SettingsScreen
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.viewmodel.CampaignViewModel
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val repository = CampaignRepositoryImpl()

        setContent {
            val dashboardViewModel = remember { DashboardViewModel(repository) }
            val campaignViewModel = remember { CampaignViewModel(repository) }

            MarketingCommandCenterTheme {
                var selectedNavItem by remember { mutableStateOf(NavigationItem.OVERVIEW) }
                val currentWorkspace by dashboardViewModel.workspace.collectAsStateWithLifecycle()

                AdaptiveNavigationShell(
                    currentWorkspace = currentWorkspace,
                    selectedItem = selectedNavItem,
                    onItemSelected = { selectedNavItem = it },
                    onWorkspaceSelected = { updatedWs ->
                        dashboardViewModel.updateWorkspace(updatedWs)
                    }
                ) {
                    when (selectedNavItem) {
                        NavigationItem.OVERVIEW -> {
                            DashboardScreen(viewModel = dashboardViewModel)
                        }
                        NavigationItem.CAMPAIGNS -> {
                            CampaignScreen(viewModel = campaignViewModel)
                        }
                        NavigationItem.PERFORMANCE -> {
                            PerformanceScreen(viewModel = dashboardViewModel)
                        }
                        NavigationItem.AUDIENCE -> {
                            CrmScreen(viewModel = dashboardViewModel)
                        }
                        NavigationItem.CALENDAR -> {
                            CalendarScreen(viewModel = dashboardViewModel)
                        }
                        NavigationItem.REPORTS -> {
                            ReportsScreen(viewModel = dashboardViewModel)
                        }
                        NavigationItem.SETTINGS -> {
                            SettingsScreen(viewModel = dashboardViewModel)
                        }
                    }
                }
            }
        }
    }
}
