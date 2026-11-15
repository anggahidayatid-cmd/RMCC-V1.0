package Athari.marketingcommandcenter.ui.screens.features

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.material.icons.automirrored.rounded.MenuOpen
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.AdminPanelSettings
import androidx.compose.material.icons.rounded.Api
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.IntegrationInstructions
import androidx.compose.material.icons.rounded.Key
import androidx.compose.material.icons.rounded.PersonAdd
import androidx.compose.material.icons.rounded.Save
import androidx.compose.material.icons.rounded.Storefront
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.data.model.Workspace
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.InfoBlue
import Athari.marketingcommandcenter.ui.theme.InfoBlueContainer
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.theme.SuccessGreenContainer
import Athari.marketingcommandcenter.ui.theme.WarningOrange
import Athari.marketingcommandcenter.ui.theme.WarningOrangeContainer
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel
import kotlinx.coroutines.launch

data class TeamMemberRecord(
    val name: String,
    val email: String,
    val role: String, // Owner, GM, Assistant Manager, Marketing, Finance
    val accessLevel: String
)

data class IntegrationChannelItem(
    val id: String,
    val name: String,
    val category: String,
    val initialEnabled: Boolean,
    val status: String
)

@Composable
fun SettingsScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    val workspace by viewModel.workspace.collectAsStateWithLifecycle()

    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val tabs = listOf("Restaurant Workspace", "Role & Access Management", "Channel Integrations")

    // Workspace edit state
    var restaurantName by remember { mutableStateOf(workspace.name) }
    var location by remember { mutableStateOf(workspace.location) }
    var diningType by remember { mutableStateOf(workspace.type) }
    var currency by remember { mutableStateOf(workspace.currency) }
    var timezone by remember { mutableStateOf(workspace.timezone) }

    var showInviteModal by remember { mutableStateOf(false) }
    var showApiKeyModal by remember { mutableStateOf<String?>(null) }

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    val teamMembers = listOf(
        TeamMemberRecord("Athari", "athari@gourmetbistro.com", "Owner", "Full Superadmin Access"),
        TeamMemberRecord("Sarah Jenkins", "sarah.j@gourmetbistro.com", "GM", "General Manager - Read/Write All"),
        TeamMemberRecord("Budi Santoso", "budi.s@gourmetbistro.com", "Marketing", "Marketing Manager - Campaigns & Performance"),
        TeamMemberRecord("Eko Prasetyo", "eko.p@gourmetbistro.com", "Finance", "Finance Controller - Budget & Spend Audit"),
        TeamMemberRecord("Rina Wijaya", "rina.w@gourmetbistro.com", "Assistant Manager", "Assistant - View & Entry Only")
    )

    val channelIntegrations = remember {
        mutableStateOf(
            listOf(
                IntegrationChannelItem("INT-001", "Meta Ads Manager (FB & IG)", "Social Ads", true, "Active API Sync"),
                IntegrationChannelItem("INT-002", "TikTok Ads Manager", "Video Ads", true, "Active API Sync"),
                IntegrationChannelItem("INT-003", "WhatsApp Business API", "Messaging", true, "Live Direct Token"),
                IntegrationChannelItem("INT-004", "Google Ads & My Business", "Search & Maps", true, "Active API Sync"),
                IntegrationChannelItem("INT-005", "POS System (Moka / Pawoon)", "Dine-In Sales", true, "Realtime Webhook"),
                IntegrationChannelItem("INT-006", "CRM & Mailchimp Sync", "Email & Audience", false, "Configured (Disabled)")
            )
        )
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Workspace Settings & Governance",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Manage restaurant workspace profile, role-based access control, and API channel integrations",
                        style = MaterialTheme.typography.bodyMedium,
                        color = SecondaryText
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Navigation Tabs
            PrimaryTabRow(selectedTabIndex = selectedTabIndex) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTabIndex == index,
                        onClick = { selectedTabIndex = index },
                        text = { Text(title, fontWeight = if (selectedTabIndex == index) FontWeight.Bold else FontWeight.Medium) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            when (selectedTabIndex) {
                0 -> WorkspaceConfigSection(
                    restaurantName = restaurantName,
                    onRestaurantNameChange = { restaurantName = it },
                    location = location,
                    onLocationChange = { location = it },
                    diningType = diningType,
                    onDiningTypeChange = { diningType = it },
                    currency = currency,
                    onCurrencyChange = { currency = it },
                    timezone = timezone,
                    onTimezoneChange = { timezone = it },
                    onSave = {
                        val updated = workspace.copy(
                            name = restaurantName,
                            location = location,
                            type = diningType,
                            currency = currency,
                            timezone = timezone
                        )
                        viewModel.updateWorkspace(updated)
                        scope.launch {
                            snackbarHostState.showSnackbar("Workspace configuration updated!")
                        }
                    }
                )

                1 -> RoleManagementSection(
                    members = teamMembers,
                    onInviteMember = { showInviteModal = true }
                )

                2 -> ChannelIntegrationsSection(
                    channels = channelIntegrations.value,
                    onToggleChannel = { id, enabled ->
                        channelIntegrations.value = channelIntegrations.value.map { item ->
                            if (item.id == id) item.copy(initialEnabled = enabled, status = if (enabled) "Active API Sync" else "Disabled") else item
                        }
                    },
                    onConfigureKey = { channelName -> showApiKeyModal = channelName }
                )
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }

    // Modal Invite Team Member Dialog
    if (showInviteModal) {
        AlertDialog(
            onDismissRequest = { showInviteModal = false },
            icon = { Icon(imageVector = Icons.Rounded.PersonAdd, contentDescription = null, tint = PrimaryPurple) },
            title = { Text("Invite New Team Member") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        label = { Text("Email Address") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = "Marketing Assistant",
                        onValueChange = {},
                        label = { Text("Role (Owner, GM, Marketing, Finance, Assistant)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showInviteModal = false
                        scope.launch { snackbarHostState.showSnackbar("Invitation email sent!") }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple)
                ) {
                    Text("Send Invitation")
                }
            },
            dismissButton = {
                TextButton(onClick = { showInviteModal = false }) { Text("Cancel") }
            }
        )
    }

    // Modal API Key Dialog Simulation
    if (showApiKeyModal != null) {
        val channelName = showApiKeyModal!!
        AlertDialog(
            onDismissRequest = { showApiKeyModal = null },
            icon = { Icon(imageVector = Icons.Rounded.Key, contentDescription = null, tint = PrimaryPurple) },
            title = { Text("Configure API Credentials ($channelName)") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Enter API Access Token or Secret Key for $channelName authentication.")
                    OutlinedTextField(
                        value = "sk_test_placeholder_key",
                        onValueChange = {},
                        label = { Text("API Access Key") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showApiKeyModal = null
                        scope.launch { snackbarHostState.showSnackbar("API Key for $channelName saved and verified!") }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple)
                ) {
                    Text("Save & Validate Key")
                }
            },
            dismissButton = {
                TextButton(onClick = { showApiKeyModal = null }) { Text("Cancel") }
            }
        )
    }
}

@Composable
private fun WorkspaceConfigSection(
    restaurantName: String,
    onRestaurantNameChange: (String) -> Unit,
    location: String,
    onLocationChange: (String) -> Unit,
    diningType: String,
    onDiningTypeChange: (String) -> Unit,
    currency: String,
    onCurrencyChange: (String) -> Unit,
    timezone: String,
    onTimezoneChange: (String) -> Unit,
    onSave: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = Icons.Rounded.Storefront, contentDescription = null, tint = PrimaryPurple)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Restaurant Workspace Details",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            OutlinedTextField(
                value = restaurantName,
                onValueChange = onRestaurantNameChange,
                label = { Text("Restaurant / Brand Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = location,
                    onValueChange = onLocationChange,
                    label = { Text("Location / City") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )

                OutlinedTextField(
                    value = diningType,
                    onValueChange = onDiningTypeChange,
                    label = { Text("Dining Category") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = currency,
                    onValueChange = onCurrencyChange,
                    label = { Text("Currency Symbol") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )

                OutlinedTextField(
                    value = timezone,
                    onValueChange = onTimezoneChange,
                    label = { Text("Default Timezone") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                Button(
                    onClick = onSave,
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.Save, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Save Workspace Settings")
                }
            }
        }
    }
}

@Composable
private fun RoleManagementSection(
    members: List<TeamMemberRecord>,
    onInviteMember: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Role-Based Access Control", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text("Team members and permission assignments for marketing operations", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
            }

            Button(
                onClick = onInviteMember,
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Rounded.PersonAdd, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("+ Invite Member")
            }
        }

        members.forEach { member ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(PrimaryPurple.copy(alpha = 0.12f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = member.name.take(1),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryPurple
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = member.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Text(text = member.email, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RoleBadge(role = member.role)
                    }
                }
            }
        }
    }
}

@Composable
private fun RoleBadge(role: String, modifier: Modifier = Modifier) {
    val (bg, fg) = when (role) {
        "Owner" -> Pair(PrimaryPurple.copy(alpha = 0.15f), PrimaryPurple)
        "GM" -> Pair(InfoBlueContainer, InfoBlue)
        "Marketing" -> Pair(SuccessGreenContainer, SuccessGreen)
        "Finance" -> Pair(WarningOrangeContainer, WarningOrange)
        else -> Pair(Color.LightGray.copy(alpha = 0.3f), Color.DarkGray)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(text = role, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = fg)
    }
}

@Composable
private fun ChannelIntegrationsSection(
    channels: List<IntegrationChannelItem>,
    onToggleChannel: (String, Boolean) -> Unit,
    onConfigureKey: (String) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Channel API & Marketing Integrations", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Connect ad managers, WhatsApp API, and POS systems for automated ROAS tracking", style = MaterialTheme.typography.bodySmall, color = SecondaryText)

        channels.forEach { channel ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(PrimaryPurple.copy(alpha = 0.12f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(imageVector = Icons.Rounded.Api, contentDescription = null, tint = PrimaryPurple)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = channel.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                Text(text = "${channel.category} • ${channel.status}", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                            }
                        }

                        Switch(
                            checked = channel.initialEnabled,
                            onCheckedChange = { onToggleChannel(channel.id, it) },
                            colors = SwitchDefaults.colors(checkedThumbColor = PrimaryPurple, checkedTrackColor = PrimaryPurple.copy(alpha = 0.3f))
                        )
                    }

                    if (channel.initialEnabled) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                            OutlinedButton(
                                onClick = { onConfigureKey(channel.name) },
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(imageVector = Icons.Rounded.Key, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Manage API Key")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun SettingsScreenPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { DashboardViewModel(repository) }
    MarketingCommandCenterTheme {
        SettingsScreen(viewModel = viewModel)
    }
}
