package Athari.marketingcommandcenter.ui.navigation

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.NavigationRailItemDefaults
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.Workspace
import Athari.marketingcommandcenter.ui.components.SidebarInsightCard
import Athari.marketingcommandcenter.ui.components.TopCommandBar
import Athari.marketingcommandcenter.ui.components.UserProfileBadge
import Athari.marketingcommandcenter.ui.components.WorkspaceSwitcher
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import kotlinx.coroutines.launch

@Composable
fun AdaptiveNavigationShell(
    currentWorkspace: Workspace,
    selectedItem: NavigationItem,
    onItemSelected: (NavigationItem) -> Unit,
    onWorkspaceSelected: (Workspace) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    BoxWithConstraints(modifier = modifier.fillMaxSize()) {
        val width = maxWidth
        val isCompact = width < 600.dp
        val isMedium = width >= 600.dp && width < 900.dp
        val isExpanded = width >= 900.dp

        ModalNavigationDrawer(
            drawerState = drawerState,
            gesturesEnabled = isCompact || isMedium,
            drawerContent = {
                ModalDrawerSheet(
                    modifier = Modifier.width(300.dp),
                    drawerContainerColor = MaterialTheme.colorScheme.surface
                ) {
                    DrawerContent(
                        currentWorkspace = currentWorkspace,
                        selectedItem = selectedItem,
                        onItemSelected = { item ->
                            onItemSelected(item)
                            scope.launch { drawerState.close() }
                        },
                        onWorkspaceSelected = onWorkspaceSelected
                    )
                }
            }
        ) {
            Row(modifier = Modifier.fillMaxSize()) {
                // Permanent Navigation Rail or Expanded Permanent Drawer for tablet / desktop
                if (isMedium) {
                    NavigationRailContent(
                        currentWorkspace = currentWorkspace,
                        selectedItem = selectedItem,
                        onItemSelected = onItemSelected,
                        onWorkspaceSelected = onWorkspaceSelected
                    )
                } else if (isExpanded) {
                    Surface(
                        modifier = Modifier
                            .width(280.dp)
                            .fillMaxHeight(),
                        color = MaterialTheme.colorScheme.surface,
                        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
                    ) {
                        DrawerContent(
                            currentWorkspace = currentWorkspace,
                            selectedItem = selectedItem,
                            onItemSelected = onItemSelected,
                            onWorkspaceSelected = onWorkspaceSelected
                        )
                    }
                }

                // Main Content Area with Top Bar & Bottom Bar (for Compact)
                Scaffold(
                    topBar = {
                        TopCommandBar(
                            currentWorkspace = currentWorkspace,
                            breadcrumbs = "Command Center / ${selectedItem.title}",
                            showMenuIcon = isCompact || isMedium,
                            onMenuClick = {
                                scope.launch {
                                    if (drawerState.isClosed) drawerState.open() else drawerState.close()
                                }
                            },
                            modifier = Modifier
                        )
                    },
                    bottomBar = {
                        if (isCompact) {
                            BottomNavigationBar(
                                selectedItem = selectedItem,
                                onItemSelected = onItemSelected
                            )
                        }
                    },
                    containerColor = MaterialTheme.colorScheme.background
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        content()
                    }
                }
            }
        }
    }
}

@Composable
private fun DrawerContent(
    currentWorkspace: Workspace,
    selectedItem: NavigationItem,
    onItemSelected: (NavigationItem) -> Unit,
    onWorkspaceSelected: (Workspace) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Workspace Switcher Header
        WorkspaceSwitcher(
            currentWorkspace = currentWorkspace,
            onWorkspaceSelected = onWorkspaceSelected
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Items
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = "MAIN MENU",
                style = MaterialTheme.typography.labelSmall,
                color = SecondaryText,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )

            NavigationItem.entries.forEach { item ->
                val isSelected = item == selectedItem
                NavigationDrawerItem(
                    label = {
                        Text(
                            text = item.title,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    },
                    selected = isSelected,
                    onClick = { onItemSelected(item) },
                    icon = {
                        Icon(
                            imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                            contentDescription = item.title
                        )
                    },
                    badge = {
                        item.badgeCount?.let { count ->
                            Badge(
                                containerColor = PrimaryPurple,
                                contentColor = MaterialTheme.colorScheme.onPrimary
                            ) {
                                Text(text = count.toString())
                            }
                        }
                    },
                    colors = NavigationDrawerItemDefaults.colors(
                        selectedContainerColor = PrimaryPurple.copy(alpha = 0.12f),
                        selectedIconColor = PrimaryPurple,
                        selectedTextColor = PrimaryPurple,
                        unselectedIconColor = SecondaryText,
                        unselectedTextColor = MaterialTheme.colorScheme.onSurface
                    ),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Contextual AI/Marketing Tip Card in Drawer
            SidebarInsightCard(
                title = "Live ROAS Insight",
                message = "Live Music October generates highest attributed revenue (Rp41.800.000). Scaling recommended."
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // User Profile Badge
        UserProfileBadge(
            userName = "Athari",
            userRole = "Marketing Director"
        )
    }
}

@Composable
private fun NavigationRailContent(
    currentWorkspace: Workspace,
    selectedItem: NavigationItem,
    onItemSelected: (NavigationItem) -> Unit,
    onWorkspaceSelected: (Workspace) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationRail(
        modifier = modifier.fillMaxHeight(),
        containerColor = MaterialTheme.colorScheme.surface,
        header = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(vertical = 12.dp)
            ) {
                WorkspaceSwitcher(
                    currentWorkspace = currentWorkspace,
                    onWorkspaceSelected = onWorkspaceSelected,
                    isCondensed = true
                )
            }
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight()
                .padding(vertical = 8.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                NavigationItem.entries.forEach { item ->
                    val isSelected = item == selectedItem
                    NavigationRailItem(
                        selected = isSelected,
                        onClick = { onItemSelected(item) },
                        icon = {
                            if (item.badgeCount != null) {
                                BadgedBox(
                                    badge = {
                                        Badge(
                                            containerColor = PrimaryPurple,
                                            contentColor = MaterialTheme.colorScheme.onPrimary
                                        ) {
                                            Text(text = item.badgeCount.toString())
                                        }
                                    }
                                ) {
                                    Icon(
                                        imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                                        contentDescription = item.title
                                    )
                                }
                            } else {
                                Icon(
                                    imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                                    contentDescription = item.title
                                )
                            }
                        },
                        label = {
                            Text(
                                text = item.title.split(" ").first(),
                                style = MaterialTheme.typography.labelSmall,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        },
                        colors = NavigationRailItemDefaults.colors(
                            selectedIconColor = PrimaryPurple,
                            selectedTextColor = PrimaryPurple,
                            indicatorColor = PrimaryPurple.copy(alpha = 0.12f),
                            unselectedIconColor = SecondaryText,
                            unselectedTextColor = SecondaryText
                        )
                    )
                }
            }

            UserProfileBadge(
                userName = "Athari",
                isCondensed = true,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }
    }
}

@Composable
private fun BottomNavigationBar(
    selectedItem: NavigationItem,
    onItemSelected: (NavigationItem) -> Unit,
    modifier: Modifier = Modifier
) {
    // For compact bottom bar, pick top 5 key destinations
    val bottomNavItems = listOf(
        NavigationItem.OVERVIEW,
        NavigationItem.CAMPAIGNS,
        NavigationItem.PERFORMANCE,
        NavigationItem.CALENDAR,
        NavigationItem.REPORTS
    )

    NavigationBar(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 4.dp
    ) {
        bottomNavItems.forEach { item ->
            val isSelected = item == selectedItem
            NavigationBarItem(
                selected = isSelected,
                onClick = { onItemSelected(item) },
                icon = {
                    if (item.badgeCount != null) {
                        BadgedBox(
                            badge = {
                                Badge(
                                    containerColor = PrimaryPurple,
                                    contentColor = MaterialTheme.colorScheme.onPrimary
                                ) {
                                    Text(text = item.badgeCount.toString())
                                }
                            }
                        ) {
                            Icon(
                                imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                                contentDescription = item.title
                            )
                        }
                    } else {
                        Icon(
                            imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                            contentDescription = item.title
                        )
                    }
                },
                label = {
                    Text(
                        text = item.title.split(" ").first(),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = PrimaryPurple,
                    selectedTextColor = PrimaryPurple,
                    indicatorColor = PrimaryPurple.copy(alpha = 0.12f),
                    unselectedIconColor = SecondaryText,
                    unselectedTextColor = SecondaryText
                )
            )
        }
    }
}
