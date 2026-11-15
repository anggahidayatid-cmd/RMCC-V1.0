package Athari.marketingcommandcenter.ui.screens.campaigns

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
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.NoteAdd
import androidx.compose.material.icons.automirrored.rounded.TrendingUp
import androidx.compose.material.icons.rounded.Analytics
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.Delete
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.MonetizationOn
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.DangerRed
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.utils.formatNumber
import Athari.marketingcommandcenter.ui.utils.formatRoas
import Athari.marketingcommandcenter.ui.utils.formatRupiah

@Composable
fun CampaignDetailPane(
    campaign: Campaign?,
    onClose: () -> Unit,
    onEditClick: (Campaign) -> Unit,
    onDeleteClick: (Campaign) -> Unit,
    modifier: Modifier = Modifier
) {
    if (campaign == null) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Rounded.Campaign,
                    contentDescription = null,
                    tint = SecondaryText,
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Select a campaign to view details",
                    style = MaterialTheme.typography.titleMedium,
                    color = SecondaryText
                )
            }
        }
        return
    }

    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val tabs = listOf("Overview", "Performance", "Budget & Targets", "Activity & Notes")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Top Navigation & Action Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onClose) {
                    Icon(imageVector = Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back")
                }
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Campaign Details",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            Row {
                OutlinedButton(
                    onClick = { onEditClick(campaign) },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Edit,
                        contentDescription = "Edit",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Edit")
                }

                Spacer(modifier = Modifier.width(8.dp))

                OutlinedButton(
                    onClick = { onDeleteClick(campaign) },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = DangerRed),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Delete,
                        contentDescription = "Delete",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Delete")
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Campaign Banner Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = campaign.name,
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(PrimaryPurple.copy(alpha = 0.12f))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = campaign.code,
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = PrimaryPurple
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "• Channel: ${campaign.channel}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = SecondaryText
                            )
                        }
                    }

                    CampaignStatusPill(status = campaign.status)
                }

                if (campaign.objective.isNotBlank()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    HorizontalDivider(color = BorderColor)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = campaign.objective,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
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

        Spacer(modifier = Modifier.height(16.dp))

        // Tab Contents
        when (selectedTabIndex) {
            0 -> OverviewTabContent(campaign)
            1 -> PerformanceTabContent(campaign)
            2 -> BudgetTargetsTabContent(campaign)
            3 -> ActivityNotesTabContent(campaign)
        }
    }
}

@Composable
private fun OverviewTabContent(campaign: Campaign) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Campaign Metadata",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryPurple
                )

                DetailRow(label = "Campaign Name", value = campaign.name)
                DetailRow(label = "Campaign Code", value = campaign.code)
                DetailRow(label = "Type", value = campaign.type.displayName)
                DetailRow(label = "Channel", value = campaign.channel)
                DetailRow(label = "Period", value = "${campaign.startDate} - ${campaign.endDate}")
                DetailRow(label = "Restaurant Workspace ID", value = campaign.restaurantId)
                DetailRow(label = "Status", value = campaign.status.displayName)
            }
        }
    }
}

@Composable
private fun PerformanceTabContent(campaign: Campaign) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Performance Stat Cards Grid
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            MetricBox(
                label = "Actual Spend",
                value = formatRupiah(campaign.spend),
                icon = Icons.Rounded.MonetizationOn,
                modifier = Modifier.weight(1f)
            )
            MetricBox(
                label = "Attributed Revenue",
                value = formatRupiah(campaign.revenue),
                icon = Icons.AutoMirrored.Rounded.TrendingUp,
                modifier = Modifier.weight(1f)
            )
            MetricBox(
                label = "Calculated ROAS",
                value = formatRoas(campaign.roas),
                icon = Icons.Rounded.Analytics,
                modifier = Modifier.weight(1f)
            )
        }

        // Auto-calculated ROAS Breakdown Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Return On Ad Spend (ROAS) Calculation",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryPurple
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Formula: Attributed Revenue (${formatRupiah(campaign.revenue)}) ÷ Actual Spend (${formatRupiah(campaign.spend)})",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SecondaryText
                )
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(PrimaryPurple.copy(alpha = 0.08f))
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Blended ROAS Result",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = formatRoas(campaign.roas),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = PrimaryPurple
                    )
                }
            }
        }
    }
}

@Composable
private fun BudgetTargetsTabContent(campaign: Campaign) {
    val budgetUtilization = if (campaign.budget > 0) (campaign.spend / campaign.budget).coerceAtMost(1.0) else 0.0
    val budgetPercent = (budgetUtilization * 100).toInt()

    val revAchieved = if (campaign.targetRevenue > 0) (campaign.revenue / campaign.targetRevenue).coerceAtMost(1.0) else 0.0
    val revPercent = (revAchieved * 100).toInt()

    val roasAchieved = if (campaign.targetRoas > 0) (campaign.roas / campaign.targetRoas).coerceAtMost(1.0) else 0.0
    val roasPercent = (roasAchieved * 100).toInt()

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Budget Utilization Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Budget Utilization",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "$budgetPercent% Spent",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { budgetUtilization.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(10.dp)
                        .clip(RoundedCornerShape(50)),
                    color = PrimaryPurple,
                    trackColor = PrimaryPurple.copy(alpha = 0.15f)
                )

                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Actual Spend: ${formatRupiah(campaign.spend)}", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    Text("Planned Budget: ${formatRupiah(campaign.budget)}", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                }
            }
        }

        // Target vs Actual Grid
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = "Target vs Actual Performance",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryPurple
                )

                TargetVsActualItem(
                    title = "Attributed Revenue",
                    targetLabel = formatRupiah(campaign.targetRevenue),
                    actualLabel = formatRupiah(campaign.revenue),
                    progress = revAchieved.toFloat(),
                    percentLabel = "$revPercent%"
                )

                TargetVsActualItem(
                    title = "ROAS Multiplier",
                    targetLabel = formatRoas(campaign.targetRoas),
                    actualLabel = formatRoas(campaign.roas),
                    progress = roasAchieved.toFloat(),
                    percentLabel = "$roasPercent%"
                )

                TargetVsActualItem(
                    title = "Reservations Target",
                    targetLabel = "${formatNumber(campaign.reservationTarget)} tables",
                    actualLabel = "${formatNumber((campaign.reservationTarget * revAchieved).toInt())} tables",
                    progress = revAchieved.toFloat(),
                    percentLabel = "$revPercent%"
                )

                TargetVsActualItem(
                    title = "Guests Target",
                    targetLabel = "${formatNumber(campaign.guestTarget)} guests",
                    actualLabel = "${formatNumber((campaign.guestTarget * revAchieved).toInt())} guests",
                    progress = revAchieved.toFloat(),
                    percentLabel = "$revPercent%"
                )
            }
        }
    }
}

@Composable
private fun ActivityNotesTabContent(campaign: Campaign) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Notes Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.AutoMirrored.Rounded.NoteAdd, contentDescription = null, tint = PrimaryPurple)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Campaign Notes & Observations",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = campaign.notes.ifBlank { "No notes entered for this campaign." },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        // Timeline Activity Log Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Activity Log & Audit Trail",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryPurple
                )

                ActivityLogEntry(
                    title = "Campaign Created",
                    timestamp = "${campaign.startDate} • System",
                    description = "Campaign '${campaign.name}' (${campaign.code}) initialized with budget ${formatRupiah(campaign.budget)}"
                )

                ActivityLogEntry(
                    title = "Performance Updated",
                    timestamp = "Recent • Manual Entry",
                    description = "Actual spend updated to ${formatRupiah(campaign.spend)}, attributed revenue set to ${formatRupiah(campaign.revenue)}"
                )

                ActivityLogEntry(
                    title = "Status Changed to ${campaign.status.displayName}",
                    timestamp = "Current Status",
                    description = "Campaign is actively monitored in the Marketing Command Center"
                )
            }
        }
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium, color = SecondaryText)
        Text(text = value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun MetricBox(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = icon, contentDescription = null, tint = PrimaryPurple, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = label, style = MaterialTheme.typography.labelMedium, color = SecondaryText)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun TargetVsActualItem(
    title: String,
    targetLabel: String,
    actualLabel: String,
    progress: Float,
    percentLabel: String
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
            Text(text = percentLabel, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = PrimaryPurple)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { progress.coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(50)),
            color = PrimaryPurple,
            trackColor = PrimaryPurple.copy(alpha = 0.15f)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Target: $targetLabel", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
            Text(text = "Actual: $actualLabel", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
private fun ActivityLogEntry(title: String, timestamp: String, description: String) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(PrimaryPurple)
                .padding(top = 4.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(text = title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
            Text(text = timestamp, style = MaterialTheme.typography.labelSmall, color = SecondaryText)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
