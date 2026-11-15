package Athari.marketingcommandcenter.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Assessment
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Campaign
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.People
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.rounded.Assessment
import androidx.compose.material.icons.rounded.BarChart
import androidx.compose.material.icons.rounded.CalendarMonth
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.Dashboard
import androidx.compose.material.icons.rounded.People
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.ui.graphics.vector.ImageVector

enum class NavigationItem(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val badgeCount: Int? = null
) {
    OVERVIEW(
        route = "overview",
        title = "Overview",
        selectedIcon = Icons.Rounded.Dashboard,
        unselectedIcon = Icons.Outlined.Dashboard
    ),
    CAMPAIGNS(
        route = "campaigns",
        title = "Campaign Management",
        selectedIcon = Icons.Rounded.Campaign,
        unselectedIcon = Icons.Outlined.Campaign,
        badgeCount = 3
    ),
    PERFORMANCE(
        route = "performance",
        title = "Performance",
        selectedIcon = Icons.Rounded.BarChart,
        unselectedIcon = Icons.Outlined.BarChart
    ),
    AUDIENCE(
        route = "audience",
        title = "Audience & CRM",
        selectedIcon = Icons.Rounded.People,
        unselectedIcon = Icons.Outlined.People
    ),
    CALENDAR(
        route = "calendar",
        title = "Calendar & Events",
        selectedIcon = Icons.Rounded.CalendarMonth,
        unselectedIcon = Icons.Outlined.CalendarMonth
    ),
    REPORTS(
        route = "reports",
        title = "Reports",
        selectedIcon = Icons.Rounded.Assessment,
        unselectedIcon = Icons.Outlined.Assessment
    ),
    SETTINGS(
        route = "settings",
        title = "Settings",
        selectedIcon = Icons.Rounded.Settings,
        unselectedIcon = Icons.Outlined.Settings
    )
}
